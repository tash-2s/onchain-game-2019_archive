import Web3 from "web3"
import { ethers } from "ethers"

import ChainEnv from "../chain/env.json"
import SpecialPlanetTokenABI from "../chain/abi/eth/SpecialPlanetToken.json"

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

  static callSpecialPlanetTokenMethod = async (methodName: string, ...args: Array<any>) => {
    const specialPlanetToken = new EthWeb3.web3.eth.Contract(
      SpecialPlanetTokenABI,
      ChainEnv.ethContractAddresses.SpecialPlanetToken
    )
    return EthWeb3.callContractMethod(specialPlanetToken, methodName, ...args)
  }

  static callContractMethod = async (contract: any, methodName: string, ...args: Array<any>) => {
    const from = await EthWeb3.address()
    return contract.methods[methodName](...args).call({ from })
  }
}
