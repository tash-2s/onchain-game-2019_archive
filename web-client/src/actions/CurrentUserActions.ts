import { AbstractActions } from "./AbstractActions"
import Web3 from "web3"
import { EthWeb3 } from "../misc/eth"
import { LoomWeb3 } from "../misc/loom"
import ChainEnv from "../chain/env.json"

export class CurrentUserActions extends AbstractActions {
  private static creator = CurrentUserActions.getActionCreator()

  static login = CurrentUserActions.creator<string | null>("login")
  login = async () => {
    this.dispatch(CurrentUserActions.login(null))

    const provider = (window as any).ethereum
    const isDappBrowser = typeof provider !== "undefined"
    if (!isDappBrowser) {
      throw new Error("you need a dapp browser")
      // alert('Looks like you need a Dapp browser to get started.')
      // alert('Consider installing MetaMask!')
    } else {
      try {
        // ask users to sign in and reveal their accounts
        await provider.enable()
        // verify the user is on the correct network
        // see also: https://github.com/MetaMask/metamask-extension/issues/3663
        if (provider.networkVersion !== ChainEnv.eth.networkId) {
          throw new Error("wrong network")
          // alert('This application requires the main network, please switch it in your MetaMask UI.')
        }

        EthWeb3.setup(provider, () => {
          new CurrentUserActions(this.dispatch).block()
          throw new Error("blocked")
        })
      } catch (error) {
        // the user rejected the request
        throw new Error("maybe rejected")
        // console.error(error)
      }
    }

    const loginAddress = await LoomWeb3.loginWithEth(EthWeb3.signer)

    this.dispatch(CurrentUserActions.login(loginAddress))
  }

  static block = CurrentUserActions.creator("block")
  block = () => {
    this.dispatch(CurrentUserActions.block())
  }
}
