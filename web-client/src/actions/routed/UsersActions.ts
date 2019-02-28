import { AbstractActions } from "../AbstractActions"
import { callLoomContractMethod } from "../../misc/loom"

export class UsersActions extends AbstractActions {
  private static creator = UsersActions.getActionCreator()

  static setUsers = UsersActions.creator<[string[], string[]]>("setUsers")
  setUsers = async () => {
    const response = await callLoomContractMethod(cs => cs.RemarkableUsers.methods.getUsers())
    this.dispatch(UsersActions.setUsers(response))
  }
}
