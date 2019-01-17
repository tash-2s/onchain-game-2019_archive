import { AbstractActions } from "../AbstractActions"

export interface TargetUserApiResponse {
  id: string
  gold: { confirmed: number; confirmedAt: number }
  userNormalPlanets: Array<{
    normalPlanetId: number
    rank: number
    rankupedAt: number | null
  }>
}

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator.async<
    { id: string },
    TargetUserApiResponse,
    Error
  >("setTargetUser")
  setTargetUser = async (id: string) => {
    const params = { id: id }
    this.dispatch(UserActions.setTargetUser.started(params))

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const tmpResult = {
        id: id,
        gold: { confirmed: 100, confirmedAt: 1547606752 },
        userNormalPlanets: [
          { normalPlanetId: 1, rank: 1, rankupedAt: null },
          { normalPlanetId: 2, rank: 1, rankupedAt: null }
        ]
      }

      if (false) {
        throw new Error("test error")
      }

      this.dispatch(
        UserActions.setTargetUser.done({
          params: params,
          result: tmpResult
        })
      )
    } catch (e) {
      this.handleError(e)
      // this.dispatch(UserActions.getTargetUser.failed({params: params, error: e}))
    }
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
}
