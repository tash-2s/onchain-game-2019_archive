import Web3 from "web3"
import { ethers } from "ethers"

export class EthWeb3 {
  static web3: Web3
  static ethersProvider: ethers.providers.Web3Provider
  static signer: ethers.Signer

  static setup = (provider: any, providerChangedFn: () => void) => {
    provider.autoRefreshOnNetworkChange = false
    provider.on("accountsChanged", providerChangedFn)
    provider.on("networkChanged", providerChangedFn)

    EthWeb3.web3 = new Web3(provider)
    EthWeb3.ethersProvider = new ethers.providers.Web3Provider(provider)
    EthWeb3.signer = EthWeb3.ethersProvider.getSigner()
  }

  static address = async () => {
    return EthWeb3.signer.getAddress()
  }
}
