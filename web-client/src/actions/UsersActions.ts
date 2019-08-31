import { AbstractActions } from "./AbstractActions"
import { chain } from "../misc/chain"

export class UsersActions extends AbstractActions {
  private static creator = UsersActions.getActionCreator()

  static setUsers = UsersActions.creator<[string | null, [string[], string[]]]>("setUsers")
  setUsers = async () => {
    const response = await chain.loom
      .remarkableUserController()
      .methods.getUsers()
      .call()
    const address = chain.loom.address

    this.dispatch(UsersActions.setUsers([address, response]))
  }
}
