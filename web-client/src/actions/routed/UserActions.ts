import { AbstractActions } from "../AbstractActions"

interface TargetUserApiResponse {
  id: string
  gold: { confirmed: number; confirmedAt: number }
  userNormalPlanets: Array<{ normalPlanetId: number }>
}

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static getTargetUser = UserActions.creator.async<
    { id: string },
    TargetUserApiResponse,
    Error
  >("getTargetUser")
  async getTargetUser(id: string) {
    const params = { id: id }
    this.dispatch(UserActions.getTargetUser.started(params))

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const tmpResult = {
        id: "test",
        gold: { confirmed: 100, confirmedAt: 1547606752 },
        userNormalPlanets: [{ normalPlanetId: 1 }, { normalPlanetId: 2 }]
      }

      if (false) {
        throw new Error("test error")
      }

      this.dispatch(
        UserActions.getTargetUser.done({
          params: params,
          result: tmpResult
        })
      )
    } catch (e) {
      this.handleError(e)
      // this.dispatch(UserActions.getTargetUser.failed({params: params, error: e}))
    }
  }

  //static updateTargetUserOngoings = UserActions.creator("updateTargetUserOngoings")
  //updateTargetUserOngoings = () => {
  //  this.dispatch(UserActions.updateTargetUserOngoings())
  //}

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }
}
