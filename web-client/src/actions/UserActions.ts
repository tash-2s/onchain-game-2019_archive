import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chain } from "../misc/chain"

export type GetUserResponse = any // TODO

interface User {
  address: string
  response: GetUserResponse
}

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<User>("setTargetUser")
  setTargetUser = async (address: string) => {
    const response = await chain.loom
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
    if (address !== chain.loom.address) {
      throw new Error("this function is for my page")
    }

    const ethTokenIds = await getTokenIds(chain.eth)
    const loomTokenIds = await getTokenIds(chain.loom)

    const needsResume = await chain.needsSpecialPlanetTokenResume(ethTokenIds)

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
      await chain.loom
        .normalPlanetController()
        .methods.setPlanet(planetId, axialCoordinateQ, axialCoordinateR)
        .send()

      const response = await chain.loom
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

      await chain.loom
        .normalPlanetController()
        .methods.rankupPlanet(userPlanetId, targetRank)
        .send()

      const response = await chain.loom
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

      await chain.loom
        .normalPlanetController()
        .methods.removePlanet(userPlanetId)
        .send()
      const response = await chain.loom
        .userController()
        .methods.getUser(address)
        .call()

      this.dispatch(UserActions.removeUserPlanet({ address, response }))
    })
  }

  static buySpecialPlanetToken = UserActions.creator<string>("buySpecialPlanetToken")
  buySpecialPlanetToken = async () => {
    new AppActions(this.dispatch).startLoading()

    const price = await chain.eth
      .specialPlanetTokenShop()
      .methods.price()
      .call()

    chain.eth
      .specialPlanetTokenShop()
      .methods.sell()
      .send({ value: price })
      .on("transactionHash", hash => {
        this.dispatch(UserActions.buySpecialPlanetToken(hash))

        new AppActions(this.dispatch).stopLoading()
      })
  }

  static transferTokenToLoom = UserActions.creator<string>("transferTokenToLoom")
  transferTokenToLoom = (tokenId: string) => {
    new AppActions(this.dispatch).startLoading()

    chain.eth
      .specialPlanetToken()
      .methods.depositToGateway(tokenId)
      .send()
      .on("transactionHash", hash => {
        this.dispatch(UserActions.transferTokenToLoom(hash))

        new AppActions(this.dispatch).stopLoading()
      })
  }

  static transferTokenToEth = UserActions.creator<string>("transferTokenToEth")
  transferTokenToEth = async (tokenId?: string) => {
    new AppActions(this.dispatch).startLoading()

    const ethAddress = chain.eth.address
    if (!ethAddress) {
      throw new Error("not logined")
    }

    const { tokenId: _tokenId, signature } = await chain.loom.prepareSpecialPlanetTokenWithdrawal(
      chain.eth.signer(),
      chain.eth.specialPlanetToken().options.address,
      tokenId
    )

    const gatewayContract = await chain.eth.gateway()
    gatewayContract.methods
      .withdrawERC721(_tokenId, signature, chain.eth.specialPlanetToken().options.address)
      .send({ from: ethAddress })
      .on("transactionHash", (hash: string) => {
        this.dispatch(UserActions.transferTokenToEth(hash))

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
  const address = chain.loom.address
  if (!address) {
    throw new Error("must login")
  }
  return address
}
