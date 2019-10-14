import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chains } from "../misc/chains"

import {
  SpecialPlanetToken,
  ReturnTypeOfGetUserSpecialPlanets,
  getUserSpecialPlanets
} from "../chain/clients/loom/organized"

import { SpecialPlanetController } from "../chain/clients/loom/SpecialPlanetController"

import ChainEnv from "../chain/env.json"
import { getSpecialPlanetTokens } from "../chain/clients/organized"
import { SpecialPlanetToken as LoomSPT } from "../chain/clients/loom/SpecialPlanetToken"
import { SpecialPlanetToken as EthSPT } from "../chain/clients/eth/SpecialPlanetToken"
import { SpecialPlanetTokenShop } from "../chain/clients/eth/SpecialPlanetTokenShop"
import { Gateway } from "../chain/clients/eth/organized"

type ExtractFromPromise<T> = T extends Promise<infer R> ? R : never

export class UserActionsForSpecialPlanet extends AbstractActions {
  private static creator = UserActionsForSpecialPlanet.getActionCreator()

  static setTargetUserPlanetTokens = UserActionsForSpecialPlanet.creator<{
    ethTokens: Array<SpecialPlanetToken>
    loomTokens: Array<SpecialPlanetToken>
    needsTransferResume: boolean
  }>("setTargetUserPlanetTokens")
  setTargetUserPlanetTokens = async () => {
    const address = loginedLoomAddress() // show my tokens

    const [ethTokens, loomTokens, receipt] = await Promise.all([
      getSpecialPlanetTokens(address, EthSPT.tokensOfOwnerByIndex),
      getSpecialPlanetTokens(address, LoomSPT.tokensOfOwnerByIndex),
      chains.getSpecialPlanetTokenTransferResumeReceipt()
    ])

    // Receipt removals can be delayed, so I need to check it if it's already withdrew.
    // If users transfer the token immediately after the resume, users may see wrong resume announcing...
    const needsTransferResume =
      !!receipt &&
      !!receipt.tokenId &&
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

      const controllerAddress = ChainEnv.loomContractAddresses.SpecialPlanetController
      const isApproved = await LoomSPT.isApprovedForAll(address, controllerAddress)
      if (!isApproved[0]) {
        await LoomSPT.setApprovalForAll(controllerAddress, true.toString()) // TODO: right?
      }

      await SpecialPlanetController.setPlanet(
        tokenId,
        axialCoordinateQ.toString(),
        axialCoordinateR.toString()
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
      await SpecialPlanetController.removePlanet(userSpecialPlanetId)

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

    const price = (await SpecialPlanetTokenShop.price())[0]

    SpecialPlanetTokenShop.sell({ value: price }).on("transactionHash", hash => {
      this.dispatch(UserActionsForSpecialPlanet.buyPlanetToken(hash))

      new AppActions(this.dispatch).stopLoading()
    })
  }

  static transferPlanetTokenToLoom = UserActionsForSpecialPlanet.creator<string>(
    "transferPlanetTokenToLoom"
  )
  transferPlanetTokenToLoom = (tokenId: string) => {
    new AppActions(this.dispatch).startLoading()

    EthSPT.depositToGateway(tokenId).on("transactionHash", hash => {
      this.dispatch(UserActionsForSpecialPlanet.transferPlanetTokenToLoom(hash))

      new AppActions(this.dispatch).stopLoading()
    })
  }

  static transferPlanetTokenToEth = UserActionsForSpecialPlanet.creator<string>(
    "transferPlanetTokenToEth"
  )
  transferPlanetTokenToEth = async (tokenId?: string) => {
    new AppActions(this.dispatch).startLoading()

    const ethAddress = chains.eth.address
    if (!ethAddress) {
      throw new Error("not logined")
    }

    if (tokenId) {
      const gatewayAddress = (await EthSPT.gateway())[0]
      await EthSPT.approve(gatewayAddress, tokenId)
    }
    const { tokenId: _tokenId, signature } = await chains.loom.prepareSpecialPlanetTokenWithdrawal(
      chains.eth.signer(),
      ChainEnv.ethContractAddresses.SpecialPlanetToken,
      tokenId
    )

    const gatewayAddress = (await EthSPT.gateway())[0]
    Gateway.withdrawERC721(
      gatewayAddress,
      _tokenId,
      signature,
      ChainEnv.ethContractAddresses.SpecialPlanetToken
    ).on("transactionHash", (hash: string) => {
      this.dispatch(UserActionsForSpecialPlanet.transferPlanetTokenToEth(hash))

      new AppActions(this.dispatch).stopLoading()
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
