import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chains } from "../misc/chains"

import { ChainContractMethods, SpecialPlanetTokenFields } from "../models/ChainContractMethods"

import { SpecialPlanetController } from "../SpecialPlanetController"

import ChainEnv from "../chain/env.json"

type ExtractFromPromise<T> = T extends Promise<infer R> ? R : never

export class UserActionsForSpecialPlanet extends AbstractActions {
  private static creator = UserActionsForSpecialPlanet.getActionCreator()

  static setTargetUserPlanetTokens = UserActionsForSpecialPlanet.creator<
    PlanetTokensResponse & {
      needsTransferResume: boolean
    }
  >("setTargetUserPlanetTokens")
  setTargetUserPlanetTokens = async () => {
    const [
      { ids: ethTokenIds, fields: ethTokenFields },
      { ids: loomTokenIds, fields: loomTokenFields },
      receipt
    ] = await Promise.all([
      getTokens(chains.eth),
      getTokens(chains.loom),
      chains.getSpecialPlanetTokenTransferResumeReceipt()
    ])

    // Receipt removals can be delayed, so I need to check it if it's already withdrew.
    // If users transfer the token immediately after the resume, users may see wrong resume announcing...
    const needsTransferResume =
      !!receipt &&
      !!receipt.tokenId &&
      (receiptTokenId => ethTokenIds.every(ethTokenId => ethTokenId !== receiptTokenId))(
        receipt.tokenId.toString()
      )

    this.dispatch(
      UserActionsForSpecialPlanet.setTargetUserPlanetTokens({
        ethTokenIds,
        ethTokenFields,
        loomTokenIds,
        loomTokenFields,
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
    ExtractFromPromise<ReturnType<typeof SpecialPlanetController.getPlanets>>
  >("setPlanetTokenToMap")
  setPlanetTokenToMap = (tokenId: string, axialCoordinateQ: number, axialCoordinateR: number) => {
    this.withLoading(async () => {
      const address = loginedLoomAddress()

      const controllerAddress = ChainEnv.loomContractAddresses.SpecialPlanetController
      const isApproved = await chains.loom
        .specialPlanetToken()
        .methods.isApprovedForAll(address, controllerAddress)
        .call()
      if (!isApproved) {
        await chains.loom
          .specialPlanetToken()
          .methods.setApprovalForAll(controllerAddress, true)
          .send()
      }

      await SpecialPlanetController.setPlanet(
        tokenId,
        axialCoordinateQ.toString(),
        axialCoordinateR.toString()
      )

      const response = await SpecialPlanetController.getPlanets(address)

      this.dispatch(
        UserActionsForSpecialPlanet.setPlanetTokenToMap({
          ...response
        })
      )
    })
  }

  static removeUserPlanetFromMap = UserActionsForSpecialPlanet.creator<
    ExtractFromPromise<ReturnType<typeof SpecialPlanetController.getPlanets>>
  >("removeUserPlanetFromMap")
  removeUserPlanetFromMap = (userSpecialPlanetId: string) => {
    this.withLoading(async () => {
      await SpecialPlanetController.removePlanet(userSpecialPlanetId)

      const response = await SpecialPlanetController.getPlanets(loginedLoomAddress())

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

    const price = await chains.eth
      .specialPlanetTokenShop()
      .methods.price()
      .call()

    chains.eth
      .specialPlanetTokenShop()
      .methods.sell()
      .send({ value: price })
      .on("transactionHash", hash => {
        this.dispatch(UserActionsForSpecialPlanet.buyPlanetToken(hash))

        new AppActions(this.dispatch).stopLoading()
      })
  }

  static transferPlanetTokenToLoom = UserActionsForSpecialPlanet.creator<string>(
    "transferPlanetTokenToLoom"
  )
  transferPlanetTokenToLoom = (tokenId: string) => {
    new AppActions(this.dispatch).startLoading()

    chains.eth
      .specialPlanetToken()
      .methods.depositToGateway(tokenId)
      .send()
      .on("transactionHash", hash => {
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

    const { tokenId: _tokenId, signature } = await chains.loom.prepareSpecialPlanetTokenWithdrawal(
      chains.eth.signer(),
      chains.eth.specialPlanetToken().options.address,
      tokenId
    )

    const gateway = await chains.eth.gateway()
    gateway.methods
      .withdrawERC721(_tokenId, signature, chains.eth.specialPlanetToken().options.address)
      .send({ from: ethAddress })
      .on("transactionHash", (hash: string) => {
        this.dispatch(UserActionsForSpecialPlanet.transferPlanetTokenToEth(hash))

        new AppActions(this.dispatch).stopLoading()
      })
  }
}

interface PlanetTokensResponse {
  ethTokenIds: Array<string>
  ethTokenFields: Array<SpecialPlanetTokenFields>
  loomTokenIds: Array<string>
  loomTokenFields: Array<SpecialPlanetTokenFields>
}

type _ExtractInstanceType<T> = new (...args: any) => T
type ExtractInstanceType<T> = T extends _ExtractInstanceType<infer R> ? R : never

const getTokens = async (c: {
  address: string | null
  specialPlanetToken: () => ExtractInstanceType<import("web3")["eth"]["Contract"]>
}) => {
  const ids = await getTokenIds(c)
  const fields = await getTokenFields(ids)
  return { ids, fields }
}

const getTokenIds = async (c: {
  address: string | null
  specialPlanetToken: () => ExtractInstanceType<import("web3")["eth"]["Contract"]>
}) => {
  const ids: Array<string> = []

  let index = "0"
  while (true) {
    const r = await c
      .specialPlanetToken()
      .methods.tokensOfOwnerByIndex(c.address, index)
      .call()

    ids.push(...r.tokenIds)

    if (r.nextIndex === "0") {
      break
    }

    index = r.nextIndex
  }

  return ids
}

const getTokenFields = async (tokenIds: Array<string>) => {
  const fields: Array<SpecialPlanetTokenFields> = []
  const batchSize = 100

  for (let i = 0; i < tokenIds.length; i += batchSize) {
    const ids = tokenIds.slice(i, i + batchSize)
    const fs = await ChainContractMethods.getSpecialPlanetTokenFields(ids)
    fields.push(...fs)
  }

  return fields
}

const loginedLoomAddress = () => {
  const address = chains.loom.address
  if (!address) {
    throw new Error("must login")
  }
  return address
}
