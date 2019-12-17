import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chains } from "../chain/chains"

import {
  SpecialPlanetToken,
  ReturnTypeOfGetUserSpecialPlanets,
  getUserSpecialPlanets
} from "../chain/clients/loom/organized"

import { SpecialPlanetController } from "../chain/clients/loom/SpecialPlanetController"

import { getSpecialPlanetTokens } from "../chain/clients/organized"
import { SpecialPlanetToken as LoomSPT } from "../chain/clients/loom/SpecialPlanetToken"
import { SpecialPlanetToken as EthSPT } from "../chain/clients/eth/SpecialPlanetToken"
import { SpecialPlanetTokenShop } from "../chain/clients/eth/SpecialPlanetTokenShop"

export class UserActionsForSpecialPlanet extends AbstractActions {
  private static creator = UserActionsForSpecialPlanet.getActionCreator()

  static setTargetUserPlanetTokens = UserActionsForSpecialPlanet.creator<{
    ethTokens: Array<SpecialPlanetToken>
    loomTokens: Array<SpecialPlanetToken>
    needsTransferResume: boolean
  }>("setTargetUserPlanetTokens")
  setTargetUserPlanetTokens = async () => {
    const address = loginedLoomAddress() // show my tokens
    const ethAddress = chains.eth.address
    if (!ethAddress) {
      throw new Error("not logined")
    }

    const [_ethTokens, _loomTokens, receipt] = await Promise.all([
      getSpecialPlanetTokens(ethAddress, new EthSPT(chains.eth)),
      getSpecialPlanetTokens(address, new LoomSPT(chains.loom)),
      chains.getSpecialPlanetTokenTransferResumeReceipt()
    ])

    // This seems typescript's issue
    // See https://github.com/microsoft/TypeScript/issues/34925
    const ethTokens = _ethTokens as NonNullable<typeof _ethTokens>
    const loomTokens = _loomTokens as NonNullable<typeof _loomTokens>

    // Receipt removals can be delayed, so I need to check it if it's already withdrew.
    // If users transfer the token immediately after the resume, users may see wrong resume announcing...
    const needsTransferResume =
      !!receipt?.tokenId &&
      (receiptTokenId => ethTokens.every(ethToken => ethToken.id !== receiptTokenId))(
        receipt.tokenId.toString()
      )

    this.dispatch(
      UserActionsForSpecialPlanet.setTargetUserPlanetTokens({
        ethTokens,
        loomTokens,
        needsTransferResume
      })
    )
  }

  static clearTargetUserPlanetTokens = UserActionsForSpecialPlanet.creator(
    "clearTargetUserPlanetTokens"
  )
  clearTargetUserPlanetTokens = () => {
    this.dispatch(UserActionsForSpecialPlanet.clearTargetUserPlanetTokens())
  }

  static setPlanetTokenToMap = UserActionsForSpecialPlanet.creator<
    ReturnTypeOfGetUserSpecialPlanets
  >("setPlanetTokenToMap")
  setPlanetTokenToMap = (tokenId: string, axialCoordinateQ: number, axialCoordinateR: number) => {
    this.withLoading(async () => {
      const address = loginedLoomAddress()

      const lockerAddress = chains.loom.env.contractAddresses.SpecialPlanetTokenLocker
      const loomSPT = new LoomSPT(chains.loom)
      const isApproved = await loomSPT.isApprovedForAll(address, lockerAddress)
      if (!isApproved) {
        await loomSPT.setApprovalForAll(lockerAddress, true)
      }

      await new SpecialPlanetController(chains.loom).setPlanet(
        tokenId,
        axialCoordinateQ,
        axialCoordinateR
      )

      const response = await getUserSpecialPlanets(address)

      this.dispatch(
        UserActionsForSpecialPlanet.setPlanetTokenToMap({
          ...response
        })
      )
    })
  }

  static removeUserPlanetFromMap = UserActionsForSpecialPlanet.creator<
    ReturnTypeOfGetUserSpecialPlanets
  >("removeUserPlanetFromMap")
  removeUserPlanetFromMap = (userSpecialPlanetId: string) => {
    this.withLoading(async () => {
      await new SpecialPlanetController(chains.loom).removePlanet(userSpecialPlanetId)

      const response = await getUserSpecialPlanets(loginedLoomAddress())

      this.dispatch(
        UserActionsForSpecialPlanet.removeUserPlanetFromMap({
          ...response
        })
      )
    })
  }

  static buyPlanetToken = UserActionsForSpecialPlanet.creator<string>("buyPlanetToken")
  buyPlanetToken = async () => {
    new AppActions(this.dispatch).startLoading()

    const shop = new SpecialPlanetTokenShop(chains.eth)

    const price = await shop.price()

    shop.mint({ value: price }).on("transactionHash", hash => {
      this.dispatch(UserActionsForSpecialPlanet.buyPlanetToken(hash))

      new AppActions(this.dispatch).stopLoading()
    })
  }

  static transferPlanetTokenToLoom = UserActionsForSpecialPlanet.creator<string>(
    "transferPlanetTokenToLoom"
  )
  transferPlanetTokenToLoom = (tokenId: string) => {
    new AppActions(this.dispatch).startLoading()

    new EthSPT(chains.eth).depositToGateway(tokenId).on("transactionHash", hash => {
      this.dispatch(UserActionsForSpecialPlanet.transferPlanetTokenToLoom(hash))

      new AppActions(this.dispatch).stopLoading()
    })
  }

  static transferPlanetTokenToEth = UserActionsForSpecialPlanet.creator<string>(
    "transferPlanetTokenToEth"
  )
  transferPlanetTokenToEth = async (tokenId?: string) => {
    this.withLoading(async () => {
      const ethAddress = chains.eth.address
      if (!ethAddress) {
        throw new Error("not logined")
      }

      if (tokenId) {
        const loomSPT = new LoomSPT(chains.loom)
        const loomGatewayAddress = await loomSPT.gateway()
        await loomSPT.approve(loomGatewayAddress, tokenId)
      }
      const receipt = await chains.loom.prepareSpecialPlanetTokenWithdrawal(
        chains.eth.signer(),
        chains.eth.env.contractAddresses.SpecialPlanetToken,
        tokenId
      )

      const ethGatewayAddress = await new EthSPT(chains.eth).gateway()
      const txHash = await chains.eth.withdrawFromGateway(receipt, ethGatewayAddress)

      this.dispatch(UserActionsForSpecialPlanet.transferPlanetTokenToEth(txHash))
    })
  }
}

const loginedLoomAddress = () => {
  const address = chains.loom.address
  if (!address) {
    throw new Error("must login")
  }
  return address
}
