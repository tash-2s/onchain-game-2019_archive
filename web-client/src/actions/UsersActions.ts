import { AbstractActions } from "./AbstractActions"
import { callLoomContractMethod, LoomWeb3 } from "../misc/loom"

export class UsersActions extends AbstractActions {
  private static creator = UsersActions.getActionCreator()

  static setUsers = UsersActions.creator<[string, [string[], string[]]]>("setUsers")
  setUsers = async () => {
    const response = await callLoomContractMethod(cs =>
      cs.RemarkableUserController.methods.getUsers()
    )
    const address = LoomWeb3.accountAddress

    this.dispatch(UsersActions.setUsers([address, response]))
  }
}
