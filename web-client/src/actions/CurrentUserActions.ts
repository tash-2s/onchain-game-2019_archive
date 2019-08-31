import { AbstractActions } from "./AbstractActions"
import Web3 from "web3"
import { EthWeb3 } from "../misc/eth"
import { chain } from "../misc/chain"

export class CurrentUserActions extends AbstractActions {
  private static creator = CurrentUserActions.getActionCreator()

  static login = CurrentUserActions.creator<{ ethAddress: string; loomAddress: string } | null>(
    "login"
  )
  login = async () => {
    this.dispatch(CurrentUserActions.login(null))

    const isSuccess = await EthWeb3.setup((window as any).ethereum, () => {
      new CurrentUserActions(this.dispatch).block()
      throw new Error("blocked")
    })
    if (!isSuccess) {
      // TODO: show message to user
      throw new Error("failed to setup eth")
    }

    const addresses = await chain.loom.loginWithEth(EthWeb3.signer)

    this.dispatch(CurrentUserActions.login(addresses))
  }

  static block = CurrentUserActions.creator("block")
  block = () => {
    this.dispatch(CurrentUserActions.block())
  }
}
