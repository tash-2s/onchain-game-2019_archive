import { AbstractActions } from "../AbstractActions"

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static readonly getTargetUser = UserActions.creator.async<
    { id: string },
    { id: string },
    Error
  >("getTargetUser")
  async getTargetUser(id: string) {
    const params = { id: id }
    this.dispatch(UserActions.getTargetUser.started(params))

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const resultId = "test"

      if (false) {
        throw new Error("test error")
      }

      this.dispatch(
        UserActions.getTargetUser.done({
          params: params,
          result: { id: resultId }
        })
      )
    } catch (e) {
      console.error(e.message)
      this.dispatch(UserActions.getTargetUser.failed(e))
      // this.dispatch(UserActions.getTargetUser.failed({params: params, error: e}))
    }
  }
}
