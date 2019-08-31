import { AbstractActions } from "./AbstractActions"
import { chains } from "../misc/chains"

export class UsersActions extends AbstractActions {
  private static creator = UsersActions.getActionCreator()

  static setUsers = UsersActions.creator<[string | null, [string[], string[]]]>("setUsers")
  setUsers = async () => {
    const response = await chains.loom
      .remarkableUserController()
      .methods.getUsers()
      .call()
    const address = chains.loom.address

    this.dispatch(UsersActions.setUsers([address, response]))
  }
}
