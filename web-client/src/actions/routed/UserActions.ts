import { AbstractActions } from "../AbstractActions"
import { callLoomContractMethod, sendLoomContractMethod, TxCallGenericsType } from "../../misc/loom"

export type GetUserResponse = TxCallGenericsType<
  ReturnType<import("../../contracts/Web").WebDefinition["methods"]["getUser"]>
>

export interface GetPlanetArgs {
  planetId: number
  axialCoordinateQ: number
  axialCoordinateR: number
  userPlanetId: number
  createdAt: number
  confirmedGold: number
}

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<{
    address: string
    response: GetUserResponse
  }>("setTargetUser")
  setTargetUser = async (address: string) => {
    const response = await callLoomContractMethod(cs => cs.Web.methods.getUser(address))

    this.dispatch(UserActions.setTargetUser({ address, response }))
  }

  static updateTargetUserOngoings = UserActions.creator("updateTargetUserOngoings")
  updateTargetUserOngoings = () => {
    this.dispatch(UserActions.updateTargetUserOngoings())
  }

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }

  static getPlanet = UserActions.creator<GetPlanetArgs>("getPlanet")
  getPlanet = async (planetId: number, axialCoordinateQ: number, axialCoordinateR: number) => {
    const receipt = await sendLoomContractMethod(cs =>
      cs.Logic.methods.setPlanet(planetId, axialCoordinateQ, axialCoordinateR)
    ).then(receipt => receipt)

    // TODO: fix
    const userPlanetId = 123
    const createdAt = 123
    const confirmedGold = 123

    this.dispatch(
      UserActions.getPlanet({
        planetId,
        axialCoordinateQ,
        axialCoordinateR,
        userPlanetId,
        createdAt,
        confirmedGold
      })
    )
  }
}
