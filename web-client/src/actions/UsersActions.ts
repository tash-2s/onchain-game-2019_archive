import { AbstractActions } from "./AbstractActions"
import { chains } from "../misc/chains"
import { HighlightedUserController } from "../chain/clients/loom/HighlightedUserController"

export class UsersActions extends AbstractActions {
  private static creator = UsersActions.getActionCreator()

  static setUsers = UsersActions.creator<
    [string | null, { accounts: Array<string>; golds: Array<string> }]
  >("setUsers")
  setUsers = async () => {
    const response = await HighlightedUserController.getUsers()
    const address = chains.loom.address

    this.dispatch(UsersActions.setUsers([address, response]))
  }
}
