import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chains } from "../chain/chains"

import {
  TradableAsteriskToken,
  ReturnTypeOfGetUserTradableAsterisks,
  getUserTradableAsterisks
} from "../chain/clients/loom/organized"

import { TradableAsteriskController } from "../chain/clients/loom/TradableAsteriskController"

import { getTradableAsteriskTokens } from "../chain/clients/organized"
import { TradableAsteriskToken as LoomSPT } from "../chain/clients/loom/TradableAsteriskToken"
import { TradableAsteriskToken as EthSPT } from "../chain/clients/eth/TradableAsteriskToken"
import { TradableAsteriskTokenShop } from "../chain/clients/eth/TradableAsteriskTokenShop"

export class UserActionsForTradableAsterisk extends AbstractActions {
  private static creator = UserActionsForTradableAsterisk.getActionCreator()

  static setTargetUserAsteriskTokens = UserActionsForTradableAsterisk.creator<{
    ethTokens: Array<TradableAsteriskToken>
    loomTokens: Array<TradableAsteriskToken>
    needsTransferResume: boolean
  }>("setTargetUserAsteriskTokens")
  setTargetUserAsteriskTokens = async () => {
    const address = loginedLoomAddress() // show my tokens
    const ethAddress = chains.eth.address
    if (!ethAddress) {
      throw new Error("not logined")
    }

    const [_ethTokens, _loomTokens, receipt] = await Promise.all([
      getTradableAsteriskTokens(ethAddress, new EthSPT(chains.eth)),
      getTradableAsteriskTokens(address, new LoomSPT(chains.loom)),
      chains.getTradableAsteriskTokenTransferResumeReceipt()
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
      UserActionsForTradableAsterisk.setTargetUserAsteriskTokens({
        ethTokens,
        loomTokens,
        needsTransferResume
      })
    )
  }

  static clearTargetUserAsteriskTokens = UserActionsForTradableAsterisk.creator(
    "clearTargetUserAsteriskTokens"
  )
  clearTargetUserAsteriskTokens = () => {
    this.dispatch(UserActionsForTradableAsterisk.clearTargetUserAsteriskTokens())
  }

  static setAsteriskTokenToMap = UserActionsForTradableAsterisk.creator<
    ReturnTypeOfGetUserTradableAsterisks
  >("setAsteriskTokenToMap")
  setAsteriskTokenToMap = (tokenId: string, axialCoordinateQ: number, axialCoordinateR: number) => {
    new AppActions(this.dispatch).withLoading(async () => {
      const address = loginedLoomAddress()

      const lockerAddress = chains.loom.env.contractAddresses.TradableAsteriskTokenLocker
      const loomSPT = new LoomSPT(chains.loom)
      const isApproved = await loomSPT.isApprovedForAll(address, lockerAddress)
      if (!isApproved) {
        await loomSPT.setApprovalForAll(lockerAddress, true)
      }

      await new TradableAsteriskController(chains.loom).setAsterisk(
        tokenId,
        axialCoordinateQ,
        axialCoordinateR
      )

      const response = await getUserTradableAsterisks(address)

      this.dispatch(
        UserActionsForTradableAsterisk.setAsteriskTokenToMap({
          ...response
        })
      )
    })
  }

  static removeUserAsteriskFromMap = UserActionsForTradableAsterisk.creator<
    ReturnTypeOfGetUserTradableAsterisks
  >("removeUserAsteriskFromMap")
  removeUserAsteriskFromMap = (userTradableAsteriskId: string) => {
    new AppActions(this.dispatch).withLoading(async () => {
      await new TradableAsteriskController(chains.loom).removeAsterisk(userTradableAsteriskId)

      const response = await getUserTradableAsterisks(loginedLoomAddress())

      this.dispatch(
        UserActionsForTradableAsterisk.removeUserAsteriskFromMap({
          ...response
        })
      )
    })
  }

  static buyAsteriskToken = UserActionsForTradableAsterisk.creator<string>("buyAsteriskToken")
  buyAsteriskToken = async () => {
    new AppActions(this.dispatch).startLoading()

    const shop = new TradableAsteriskTokenShop(chains.eth)

    const price = await shop.price()

    shop.mint({ value: price }).on("transactionHash", hash => {
      this.dispatch(UserActionsForTradableAsterisk.buyAsteriskToken(hash))

      new AppActions(this.dispatch).stopLoading()
    })
  }

  static transferAsteriskTokenToLoom = UserActionsForTradableAsterisk.creator<string>(
    "transferAsteriskTokenToLoom"
  )
  transferAsteriskTokenToLoom = (tokenId: string) => {
    new AppActions(this.dispatch).startLoading()

    new EthSPT(chains.eth).depositToGateway(tokenId).on("transactionHash", hash => {
      this.dispatch(UserActionsForTradableAsterisk.transferAsteriskTokenToLoom(hash))

      new AppActions(this.dispatch).stopLoading()
    })
  }

  static transferAsteriskTokenToEth = UserActionsForTradableAsterisk.creator<string>(
    "transferAsteriskTokenToEth"
  )
  transferAsteriskTokenToEth = async (tokenId?: string) => {
    new AppActions(this.dispatch).withLoading(async () => {
      const ethAddress = chains.eth.address
      if (!ethAddress) {
        throw new Error("not logined")
      }

      if (tokenId) {
        const loomSPT = new LoomSPT(chains.loom)
        const loomGatewayAddress = await loomSPT.gateway()
        await loomSPT.approve(loomGatewayAddress, tokenId)
      }
      const receipt = await chains.loom.prepareTradableAsteriskTokenWithdrawal(
        chains.eth.signer(),
        chains.eth.env.contractAddresses.TradableAsteriskToken,
        tokenId
      )

      const ethGatewayAddress = await new EthSPT(chains.eth).gateway()
      const txHash = await chains.eth.withdrawFromGateway(receipt, ethGatewayAddress)

      this.dispatch(UserActionsForTradableAsterisk.transferAsteriskTokenToEth(txHash))
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
