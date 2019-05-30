import { AbstractActions } from "../AbstractActions"
import {
  callLoomContractMethod,
  sendLoomContractMethod,
  TxCallGenericsType,
  LoomWeb3
} from "../../misc/loom"
import { TargetUserState } from "../../types/routed/userTypes"

export type GetUserResponse = TxCallGenericsType<
  ReturnType<
    import("../../chain/types/UserController").UserControllerDefinition["methods"]["getUser"]
  >
>

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

      const address = LoomWeb3.accountAddress
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

  static rankupUserNormalPlanet = UserActions.creator<User>("rankupUserNormalPlanet")
  rankupUserNormalPlanet = (userPlanetId: string, targetRank: number) => {
    this.withLoading(async () => {
      const address = LoomWeb3.accountAddress
      await sendLoomContractMethod(cs =>
        cs.NormalPlanetController.methods.rankupPlanet(userPlanetId, targetRank)
      )
      const response = await callLoomContractMethod(cs =>
        cs.UserController.methods.getUser(address)
      )
      this.dispatch(UserActions.rankupUserNormalPlanet({ address, response }))
    })
  }

  static removeUserNormalPlanet = UserActions.creator<User>("removeUserNormalPlanet")
  removeUserNormalPlanet = (userPlanetId: string) => {
    this.withLoading(async () => {
      const address = LoomWeb3.accountAddress
      await sendLoomContractMethod(cs =>
        cs.NormalPlanetController.methods.removePlanet(userPlanetId)
      )
      const response = await callLoomContractMethod(cs =>
        cs.UserController.methods.getUser(address)
      )
      this.dispatch(UserActions.removeUserNormalPlanet({ address, response }))
    })
  }
}
