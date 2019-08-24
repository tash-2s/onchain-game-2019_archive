import { AbstractActions } from "./AbstractActions"
import Web3 from "web3"
import { EthWeb3 } from "../misc/eth"

export class CurrentUserActions extends AbstractActions {
  private static creator = CurrentUserActions.getActionCreator()

  static login = CurrentUserActions.creator<boolean>("login")
  login = async () => {
    this.dispatch(CurrentUserActions.login(true))

    const provider = (window as any).ethereum
    const isDappBrowser = typeof provider !== "undefined"
    if (!isDappBrowser) {
      throw new Error("you need a dapp browser")
      // alert('Looks like you need a Dapp browser to get started.')
      // alert('Consider installing MetaMask!')
    } else {
      try {
        // ask users to sign in and reveal their accounts
        const account = (await provider.enable())[0]
        // verify the user is on the correct network
        // see also: https://github.com/MetaMask/metamask-extension/issues/3663
        if (provider.networkVersion !== "5777") {
          throw new Error("wrong network")
          // alert('This application requires the main network, please switch it in your MetaMask UI.')
        }

        EthWeb3.web3 = new Web3(provider)
      } catch (error) {
        // the user rejected the request
        throw new Error("maybe rejected")
        // console.error(error)
      }
    }

    this.dispatch(CurrentUserActions.login(false))
  }
}
