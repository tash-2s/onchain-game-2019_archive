import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chains } from "../misc/chains"

export type GetUserResponse = any // TODO

interface User {
  address: string
  response: GetUserResponse
}

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<User>("setTargetUser")
  setTargetUser = async (address: string) => {
    const response = await chains.loom
      .userController()
      .methods.getUser(address)
      .call()
    this.dispatch(UserActions.setTargetUser({ address, response }))
  }

  static setTargetUserSpecialPlanetTokens = UserActions.creator<{
    eth: Array<string>
    loom: Array<string>
    needsResume: boolean
  }>("setTargetUserSpecialPlanetTokens")
  setTargetUserSpecialPlanetTokens = async (address: string) => {
    if (address !== chains.loom.address) {
      throw new Error("this function is for my page")
    }

    const ethTokenIds = await getTokenIds(chains.eth)
    const loomTokenIds = await getTokenIds(chains.loom)

    const needsResume = await chains.needsSpecialPlanetTokenResume(ethTokenIds)

    this.dispatch(
      UserActions.setTargetUserSpecialPlanetTokens({
        eth: ethTokenIds,
        loom: loomTokenIds,
        needsResume
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
      const address = loginedAddress()
      await chains.loom
        .normalPlanetController()
        .methods.setPlanet(planetId, axialCoordinateQ, axialCoordinateR)
        .send()

      const response = await chains.loom
        .userController()
        .methods.getUser(address)
        .call()

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
      const address = loginedAddress()

      await chains.loom
        .normalPlanetController()
        .methods.rankupPlanet(userPlanetId, targetRank)
        .send()

      const response = await chains.loom
        .userController()
        .methods.getUser(address)
        .call()

      this.dispatch(UserActions.rankupUserPlanet({ address, response }))
    })
  }

  static removeUserPlanet = UserActions.creator<User>("removeUserPlanet")
  removeUserPlanet = (userPlanetId: string) => {
    this.withLoading(async () => {
      const address = loginedAddress()

      await chains.loom
        .normalPlanetController()
        .methods.removePlanet(userPlanetId)
        .send()
      const response = await chains.loom
        .userController()
        .methods.getUser(address)
        .call()

      this.dispatch(UserActions.removeUserPlanet({ address, response }))
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

const loginedAddress = () => {
  const address = chains.loom.address
  if (!address) {
    throw new Error("must login")
  }
  return address
}
