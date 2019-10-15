import { AbstractActions } from "./AbstractActions"
import { chains } from "../chain/chains"

export class CurrentUserActions extends AbstractActions {
  private static creator = CurrentUserActions.getActionCreator()

  static login = CurrentUserActions.creator<{ ethAddress: string; loomAddress: string } | null>(
    "login"
  )
  login = async () => {
    this.dispatch(CurrentUserActions.login(null))

    const result = await chains.login((window as any).ethereum, this.block)

    if (!result) {
      // TODO: show message to user
      throw new Error("failed to setup eth")
    }

    this.dispatch(CurrentUserActions.login(result))
  }

  static block = CurrentUserActions.creator("block")
  block = () => {
    this.dispatch(CurrentUserActions.block())
  }
}
