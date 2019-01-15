import { AbstractActions } from "../AbstractActions"
import { User } from "../../types/routed/userTypes"

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static getTargetUser = UserActions.creator.async<{ id: string }, User, Error>(
    "getTargetUser"
  )
  async getTargetUser(id: string) {
    const params = { id: id }
    this.dispatch(UserActions.getTargetUser.started(params))

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const tmpResult = { id: "test", gold: 100 }

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

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }
}
