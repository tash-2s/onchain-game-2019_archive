import { AbstractActions } from "../AbstractActions"

export class UsersActions extends AbstractActions {
  private static creator = UsersActions.getActionCreator()

  static setUsers = UsersActions.creator<Array<{ id: string }>>("setUsers")
  setUsers = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.dispatch(UsersActions.setUsers([{ id: "test" }]))
  }
}
