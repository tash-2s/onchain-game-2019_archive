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

interface GetUser {
  address: string
  response: GetUserResponse
}

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<GetUser>("setTargetUser")
  setTargetUser = async (address: string) => {
    const response = await callLoomContractMethod(cs => cs.UserController.methods.getUser(address))
    this.dispatch(UserActions.setTargetUser({ address, response }))
  }

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }

  static changeSelectedUserPlanetsTab = UserActions.creator<
    TargetUserState["selectedUserPlanetsTab"]
  >("changeSelectedUserPlanetsTab")
  changeSelectedUserPlanetsTab = (tab: TargetUserState["selectedUserPlanetsTab"]) => {
    this.dispatch(UserActions.changeSelectedUserPlanetsTab(tab))
  }

  static setPlanetToGet = UserActions.creator<number>("setPlanetToGet")
  setPlanetToGet = (planetId: number) => {
    this.dispatch(UserActions.setPlanetToGet(planetId))
  }

  static getPlanet = UserActions.creator<GetUser>("getPlanet")
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

  static rankupUserNormalPlanet = UserActions.creator<GetUser>("rankupUserNormalPlanet")
  rankupUserNormalPlanet = (userPlanetId: string) => {
    this.withLoading(async () => {
      const address = LoomWeb3.accountAddress
      await sendLoomContractMethod(cs =>
        cs.NormalPlanetController.methods.rankupPlanet(userPlanetId)
      )
      const response = await callLoomContractMethod(cs =>
        cs.UserController.methods.getUser(address)
      )
      this.dispatch(UserActions.rankupUserNormalPlanet({ address, response }))
    })
  }

  static removeUserNormalPlanet = UserActions.creator<GetUser>("removeUserNormalPlanet")
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
