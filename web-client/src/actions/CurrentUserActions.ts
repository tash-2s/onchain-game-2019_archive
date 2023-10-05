import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"

import { chains } from "../chain/chains"

export class CurrentUserActions extends AbstractActions {
  private static creator = CurrentUserActions.getActionCreator()

  static login = CurrentUserActions.creator<{ ethAddress: string; loomAddress: string } | null>(
    "login"
  )
  login = async () => {
    this.dispatch(CurrentUserActions.login(null))

    const result = await chains.login((window as any).ethereum, () =>
      new AppActions(this.dispatch).showError("The account or the chain was changed.")
    )

    if (result) {
      this.dispatch(CurrentUserActions.login(result))
    } else {
      new AppActions(this.dispatch).showError(
        "You failed to login. Please check you have a wallet like MetaMask, and you are connecting the right chain."
      )
    }
  }
}
