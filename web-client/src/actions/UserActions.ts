import { AbstractActions } from "./AbstractActions"
import { callLoomContractMethod, sendLoomContractMethod, LoomWeb3 } from "../misc/loom"
import { EthWeb3 } from "../misc/eth"

export type GetUserResponse = any // TODO

interface User {
  address: string
  response: GetUserResponse
}

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<User>("setTargetUser")
  setTargetUser = async (address: string) => {
    const response = await callLoomContractMethod(cs => cs.UserController.methods.getUser(address))
    this.dispatch(UserActions.setTargetUser({ address, response }))
  }

  static setTargetUserSpecialPlanetTokens = UserActions.creator<{
    eth: Array<string>
    loom: Array<string>
  }>("setTargetUserSpecialPlanetTokens")
  setTargetUserSpecialPlanetTokens = async (address: string) => {
    const ethTokenIds: Array<string> = []
    const ethBalance = await EthWeb3.callSpecialPlanetTokenMethod("balanceOf", address)
    for (let i = 0; i < ethBalance; i++) {
      ethTokenIds.push(
        await EthWeb3.callSpecialPlanetTokenMethod("tokenOfOwnerByIndex", address, i)
      )
    }

    const loomTokenIds: Array<string> = []
    const loomBalance = await callLoomContractMethod(cs =>
      cs.SpecialPlanetToken.methods.balanceOf(address)
    )
    for (let i = 0; i < loomBalance; i++) {
      loomTokenIds.push(
        await callLoomContractMethod(cs =>
          cs.SpecialPlanetToken.methods.tokenOfOwnerByIndex(address, i)
        )
      )
    }

    this.dispatch(
      UserActions.setTargetUserSpecialPlanetTokens({ eth: ethTokenIds, loom: loomTokenIds })
    )
  }

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }

  static getPlanet = UserActions.creator<User>("getPlanet")
  getPlanet = (planetId: number, axialCoordinateQ: number, axialCoordinateR: number) => {
    this.withLoading(async () => {
      await sendLoomContractMethod(cs =>
        cs.NormalPlanetController.methods.setPlanet(planetId, axialCoordinateQ, axialCoordinateR)
      )

      const address = LoomWeb3.loginAddress
      const response = await callLoomContractMethod(cs =>
        cs.UserController.methods.getUser(address)
      )

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
      const address = LoomWeb3.loginAddress
      await sendLoomContractMethod(cs =>
        cs.NormalPlanetController.methods.rankupPlanet(userPlanetId, targetRank)
      )
      const response = await callLoomContractMethod(cs =>
        cs.UserController.methods.getUser(address)
      )
      this.dispatch(UserActions.rankupUserPlanet({ address, response }))
    })
  }

  static removeUserPlanet = UserActions.creator<User>("removeUserPlanet")
  removeUserPlanet = (userPlanetId: string) => {
    this.withLoading(async () => {
      const address = LoomWeb3.loginAddress
      await sendLoomContractMethod(cs =>
        cs.NormalPlanetController.methods.removePlanet(userPlanetId)
      )
      const response = await callLoomContractMethod(cs =>
        cs.UserController.methods.getUser(address)
      )
      this.dispatch(UserActions.removeUserPlanet({ address, response }))
    })
  }
}
