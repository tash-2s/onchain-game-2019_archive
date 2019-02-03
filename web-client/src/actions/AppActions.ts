import { AbstractActions } from "./AbstractActions"
import { callLoomContractMethod } from "../misc/loom"

export class AppActions extends AbstractActions {
  private static creator = AppActions.getActionCreator()

  static setBalance = AppActions.creator<number>("setBalance")
  setBalance = async (address: string) => {
    const balance = await callLoomContractMethod(cs =>
      cs.testNFT.methods.balanceOf(address)
    )
    this.dispatch(AppActions.setBalance(parseInt(balance, 10)))
  }
}
