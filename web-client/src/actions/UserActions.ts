import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chain } from "../misc/chain"
import { withGateway, getWithdrawalReceipt, withdrawPreparation } from "../misc/loom"

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

    const ethTokenIds: Array<string> = []
    const ethBalance = await chain.eth
      .specialPlanetToken()
      .methods.balanceOf(chain.eth.address)
      .call()
    for (let i = 0; i < ethBalance; i++) {
      ethTokenIds.push(
        await chain.eth
          .specialPlanetToken()
          .methods.tokenOfOwnerByIndex(chain.eth.address, i)
          .call()
      )
    }

    const loomTokenIds: Array<string> = []
    const loomBalance = await chain.loom
      .specialPlanetToken()
      .methods.balanceOf(chain.loom.address)
      .call()
    for (let i = 0; i < loomBalance; i++) {
      loomTokenIds.push(
        await chain.loom
          .specialPlanetToken()
          .methods.tokenOfOwnerByIndex(chain.loom.address, i)
          .call()
      )
    }

    const needsResume = await withGateway(chain.eth.signer(), async gateway => {
      const receipt = await getWithdrawalReceipt(
        chain,
        chain.eth.signer(),
        chain.eth.specialPlanetToken().options.address,
        gateway
      )

      if (!receipt) {
        return false
      }
      if (!receipt.tokenId) {
        return false
      }

      // Receipt removals can be delayed, so I need to check it if it's already withdrew.
      // If users transfer the token immediately after the resume, users may see wrong resume announcing...
      const tokenIdStr = receipt.tokenId.toString()
      let alreadyWithdrew = false
      ethTokenIds.forEach(id => {
        if (id === tokenIdStr) {
          alreadyWithdrew = true
        }
      })
      if (alreadyWithdrew) {
        return false
      }

      return true
    })

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
    const { tokenId: _tokenId, signature } = await withdrawPreparation(
      chain,
      chain.eth.signer(),
      chain.eth.specialPlanetToken().options.address,
      tokenId
    )
    const gatewayContract = await chain.eth.gateway()
    withdrawTokenFromEthGateway(gatewayContract, _tokenId, signature).on(
      "transactionHash",
      (hash: string) => {
        this.dispatch(UserActions.transferTokenToEth(hash))

        new AppActions(this.dispatch).stopLoading()
      }
    )
  }
}

const loginedAddress = () => {
  const address = chain.loom.address
  if (!address) {
    throw new Error("must login")
  }
  return address
}

const withdrawTokenFromEthGateway = (gatewayContract: any, tokenId: string, signature: string) => {
  const tokenAddress = chain.eth.specialPlanetToken().options.address

  return gatewayContract.methods
    .withdrawERC721(tokenId, signature, tokenAddress)
    .send({ from: chain.eth.address })
}
