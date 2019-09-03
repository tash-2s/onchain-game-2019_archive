import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chains } from "../misc/chains"

const getUserAll = async (
  address: string
): Promise<
  [
    [string, string, Array<string>, Array<string>, Array<string>, Array<string>],
    [Array<string>, Array<string>, Array<string>, Array<string>, Array<string>, Array<string>]
  ]
> => {
  const response1 = await chains.loom
    .userController()
    .methods.getUser(address)
    .call()

  const response2 = await chains.loom
    .specialPlanetController()
    .methods.getPlanets(address)
    .call()

  return [response1, response2]
}

type ExtractFromPromise<T> = T extends Promise<infer R> ? R : never
export type UserAllResponse = ExtractFromPromise<ReturnType<typeof getUserAll>>

interface User {
  address: string
  response: UserAllResponse
}

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<User>("setTargetUser")
  setTargetUser = async (address: string) => {
    const response = await getUserAll(address)
    this.dispatch(UserActions.setTargetUser({ address, response }))
  }

  static setTargetUserSpecialPlanetTokens = UserActions.creator<{
    eth: Array<string>
    ethFields: Array<Array<string>>
    loom: Array<string>
    loomFields: Array<Array<string>>
    needsTransferResume: boolean
  }>("setTargetUserSpecialPlanetTokens")
  setTargetUserSpecialPlanetTokens = async (address: string) => {
    if (address !== chains.loom.address) {
      throw new Error("this function is for my page")
    }

    const ethTokenIds = await getTokenIds(chains.eth)
    const ethFields: Array<Array<string>> = []
    for (const tokenId of ethTokenIds) {
      ethFields.push(
        await chains.loom
          .specialPlanetController()
          .methods.getPlanetFieldsFromTokenId(tokenId)
          .call()
      )
    }

    const loomTokenIds = await getTokenIds(chains.loom)
    const loomFields: Array<Array<string>> = []
    for (const tokenId of loomTokenIds) {
      loomFields.push(
        await chains.loom
          .specialPlanetController()
          .methods.getPlanetFieldsFromTokenId(tokenId)
          .call()
      )
    }

    const needsResume = await chains.needsSpecialPlanetTokenResume(ethTokenIds)

    this.dispatch(
      UserActions.setTargetUserSpecialPlanetTokens({
        eth: ethTokenIds,
        ethFields,
        loom: loomTokenIds,
        loomFields,
        needsTransferResume: needsResume
      })
    )
  }

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }

  static getPlanet = UserActions.creator<User>("getPlanet")
  getPlanet = (planetId: number, axialCoordinateQ: number, axialCoordinateR: number) => {
    this.withLoading(async () => {
      const address = loginedLoomAddress()

      await chains.loom
        .normalPlanetController()
        .methods.setPlanet(planetId, axialCoordinateQ, axialCoordinateR)
        .send()

      const response = await getUserAll(address)

      this.dispatch(
        UserActions.getPlanet({
          address,
          response
        })
      )
    })
  }

  static rankupUserPlanet = UserActions.creator<User>("rankupUserPlanet")
  rankupUserPlanet = (userPlanetId: string, targetRank: number) => {
    this.withLoading(async () => {
      const address = loginedLoomAddress()

      await chains.loom
        .normalPlanetController()
        .methods.rankupPlanet(userPlanetId, targetRank)
        .send()

      const response = await getUserAll(address)

      this.dispatch(UserActions.rankupUserPlanet({ address, response }))
    })
  }

  static removeUserPlanet = UserActions.creator<User>("removeUserPlanet")
  removeUserPlanet = (userPlanetId: string) => {
    this.withLoading(async () => {
      const address = loginedLoomAddress()

      await chains.loom
        .normalPlanetController()
        .methods.removePlanet(userPlanetId)
        .send()

      const response = await getUserAll(address)

      this.dispatch(UserActions.removeUserPlanet({ address, response }))
    })
  }

  static setSpecialPlanetTokenToMap = UserActions.creator<User>("setSpecialPlanetTokenToMap")
  setSpecialPlanetTokenToMap = (
    tokenId: string,
    axialCoordinateQ: number,
    axialCoordinateR: number
  ) => {
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

      const response = await getUserAll(address)

      this.dispatch(
        UserActions.setSpecialPlanetTokenToMap({
          address,
          response
        })
      )
    })
  }

  static buySpecialPlanetToken = UserActions.creator<string>("buySpecialPlanetToken")
  buySpecialPlanetToken = async () => {
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
        this.dispatch(UserActions.buySpecialPlanetToken(hash))

        new AppActions(this.dispatch).stopLoading()
      })
  }

  static transferSpecialPlanetTokenToLoom = UserActions.creator<string>(
    "transferSpecialPlanetTokenToLoom"
  )
  transferSpecialPlanetTokenToLoom = (tokenId: string) => {
    new AppActions(this.dispatch).startLoading()

    chains.eth
      .specialPlanetToken()
      .methods.depositToGateway(tokenId)
      .send()
      .on("transactionHash", hash => {
        this.dispatch(UserActions.transferSpecialPlanetTokenToLoom(hash))

        new AppActions(this.dispatch).stopLoading()
      })
  }

  static transferSpecialPlanetTokenToEth = UserActions.creator<string>(
    "transferSpecialPlanetTokenToEth"
  )
  transferSpecialPlanetTokenToEth = async (tokenId?: string) => {
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

    const gatewayContract = await chains.eth.gateway()
    gatewayContract.methods
      .withdrawERC721(_tokenId, signature, chains.eth.specialPlanetToken().options.address)
      .send({ from: ethAddress })
      .on("transactionHash", (hash: string) => {
        this.dispatch(UserActions.transferSpecialPlanetTokenToEth(hash))

        new AppActions(this.dispatch).stopLoading()
      })
  }
}

type _ExtractInstanceType<T> = new (...args: any) => T
type ExtractInstanceType<T> = T extends _ExtractInstanceType<infer R> ? R : never

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

const loginedLoomAddress = () => {
  const address = chains.loom.address
  if (!address) {
    throw new Error("must login")
  }
  return address
}
