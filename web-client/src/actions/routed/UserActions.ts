import { AbstractActions } from "../AbstractActions"
import {
  callLoomContractMethod,
  sendLoomContractMethod,
  TxCallGenericsType,
  LoomWeb3
} from "../../misc/loom"

export type GetUserResponse = TxCallGenericsType<
  ReturnType<import("../../contracts/Web").WebDefinition["methods"]["getUser"]>
>

interface GetUser {
  address: string
  response: GetUserResponse
}

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<GetUser>("setTargetUser")
  setTargetUser = async (address: string) => {
    const response = await callLoomContractMethod(cs => cs.Web.methods.getUser(address))
    this.dispatch(UserActions.setTargetUser({ address, response }))
  }

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }

  static getPlanet = UserActions.creator<GetUser>("getPlanet")
  getPlanet = async (planetId: number, axialCoordinateQ: number, axialCoordinateR: number) => {
    this.overallLoading()

    await sendLoomContractMethod(cs =>
      cs.Logic.methods.setPlanet(planetId, axialCoordinateQ, axialCoordinateR)
    )

    const address = LoomWeb3.accountAddress
    const response = await callLoomContractMethod(cs => cs.Web.methods.getUser(address))

    this.dispatch(
      UserActions.getPlanet({
        address,
        response
      })
    )
  }

  static rankupUserNormalPlanet = UserActions.creator<GetUser>("rankupUserNormalPlanet")
  rankupUserNormalPlanet = async (userPlanetId: number) => {
    this.overallLoading()

    const address = LoomWeb3.accountAddress

    await sendLoomContractMethod(cs => cs.Logic.methods.rankupUserNormalPlanet(userPlanetId))
    const response = await callLoomContractMethod(cs => cs.Web.methods.getUser(address))
    this.dispatch(UserActions.rankupUserNormalPlanet({ address, response }))
  }
}
