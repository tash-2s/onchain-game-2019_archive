import { AbstractActions } from "./AbstractActions"
import { chain } from "../misc/chain"

export class CurrentUserActions extends AbstractActions {
  private static creator = CurrentUserActions.getActionCreator()

  static login = CurrentUserActions.creator<{ ethAddress: string; loomAddress: string } | null>(
    "login"
  )
  login = async () => {
    this.dispatch(CurrentUserActions.login(null))

    const isSuccess = await chain.eth.login((window as any).ethereum, () => {
      new CurrentUserActions(this.dispatch).block()
      throw new Error("blocked")
    })
    if (!isSuccess) {
      // TODO: show message to user
      throw new Error("failed to setup eth")
    }

    const addresses = await chain.loom.loginWithEth(chain.eth.signer())

    this.dispatch(CurrentUserActions.login(addresses))
  }

  static block = CurrentUserActions.creator("block")
  block = () => {
    this.dispatch(CurrentUserActions.block())
  }
}
