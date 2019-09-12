import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"
import { getUserAndUserSpecialPlanets, UserAndUserSpecialPlanetsResponse } from "./UserActions"

import { chains } from "../misc/chains"

import { ChainContractMethods, SpecialPlanetTokenFields } from "../models/ChainContractMethods"

export class UserActionsForSpecialPlanet extends AbstractActions {
  private static creator = UserActionsForSpecialPlanet.getActionCreator()

  static setTargetUserPlanetTokens = UserActionsForSpecialPlanet.creator<
    PlanetTokensResponse & {
      needsTransferResume: boolean
    }
  >("setTargetUserPlanetTokens")
  setTargetUserPlanetTokens = async () => {
    const { ids: ethTokenIds, fields: ethTokenFields } = await getTokens(chains.eth)
    const { ids: loomTokenIds, fields: loomTokenFields } = await getTokens(chains.loom)

    const needsTransferResume = await chains.needsSpecialPlanetTokenResume(ethTokenIds)

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
    UserAndUserSpecialPlanetsResponse
  >("setPlanetTokenToMap")
  setPlanetTokenToMap = (tokenId: string, axialCoordinateQ: number, axialCoordinateR: number) => {
    this.withLoading(async () => {
      const address = loginedLoomAddress()

      const controllerAddress = chains.loom.specialPlanetController().options.address
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

      await chains.loom
        .specialPlanetController()
        .methods.setPlanet(tokenId, axialCoordinateQ, axialCoordinateR)
        .send()

      const response = await getUserAndUserSpecialPlanets(address)

      this.dispatch(
        UserActionsForSpecialPlanet.setPlanetTokenToMap({
          ...response
        })
      )
    })
  }

  static removeUserPlanetFromMap = UserActionsForSpecialPlanet.creator<
    UserAndUserSpecialPlanetsResponse
  >("removeUserPlanetFromMap")
  removeUserPlanetFromMap = (userSpecialPlanetId: string) => {
    this.withLoading(async () => {
      await chains.loom
        .specialPlanetController()
        .methods.removePlanet(userSpecialPlanetId)
        .send()

      const response = await getUserAndUserSpecialPlanets(loginedLoomAddress())

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
  const balance = await c
    .specialPlanetToken()
    .methods.balanceOf(c.address)
    .call()
  for (let i = 0; i < balance; i++) {
    ids.push(
      await c
        .specialPlanetToken()
        .methods.tokenOfOwnerByIndex(c.address, i)
        .call()
    )
  }
  return ids
}

const getTokenFields = async (tokenIds: Array<string>) => {
  const fields: Array<SpecialPlanetTokenFields> = []
  for (const tokenId of tokenIds) {
    fields.push(await ChainContractMethods.getSpecialPlanetTokenFields(tokenId))
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
