import { AbstractActions } from "./AbstractActions"
import { LoomWeb3 } from "../misc/loom"

export class CurrentUserActions extends AbstractActions {
  private static creator = CurrentUserActions.getActionCreator()

  static signup = CurrentUserActions.creator<string>("signup")
  signup = () => {
    const address = LoomWeb3.resetWithNewAccount()
    this.dispatch(CurrentUserActions.signup(address))
  }
}
