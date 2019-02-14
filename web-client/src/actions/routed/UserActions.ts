import { AbstractActions } from "../AbstractActions"
import { callLoomContractMethod, TxCallGenericsType } from "../../misc/loom"

export type GetUserResponse = TxCallGenericsType<
  ReturnType<import("../../contracts/Web").WebDefinition["methods"]["getUser"]>
>

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<{
    address: string
    response: GetUserResponse
  }>("setTargetUser")
  setTargetUser = async (address: string) => {
    const response = await callLoomContractMethod(cs =>
      cs.Web.methods.getUser(address)
    )

    this.dispatch(UserActions.setTargetUser({ address, response }))
  }

  static updateTargetUserOngoings = UserActions.creator(
    "updateTargetUserOngoings"
  )
  updateTargetUserOngoings = () => {
    this.dispatch(UserActions.updateTargetUserOngoings())
  }

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }

  static getPlanet = UserActions.creator<{
    id: string
    normalPlanetId: number
    rank: number
    rankupedAt: number
    createdAt: number
    axialCoordinates: [number, number] // [q, r]
  }>("getPlanet")
  getPlanet = (planetId: number) => {
    const tmp = {
      id: "unp3",
      normalPlanetId: planetId,
      rank: 2,
      rankupedAt: 1547878452,
      createdAt: 1547206752,
      axialCoordinates: [0, 1] as [number, number]
    }
    this.dispatch(UserActions.getPlanet(tmp))
  }
}
