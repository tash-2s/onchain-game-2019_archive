import Web3 from "web3"
import { ethers } from "ethers"

import ChainEnv from "../chain/env.json"
import SpecialPlanetTokenABI from "../chain/abi/eth/SpecialPlanetToken.json"
import SpecialPlanetTokenShopABI from "../chain/abi/eth/SpecialPlanetTokenShop.json"

const GatewayABI = [
  {
    constant: false,
    inputs: [
      {
        name: "uid",
        type: "uint256"
      },
      {
        name: "sig",
        type: "bytes"
      },
      {
        name: "contractAddress",
        type: "address"
      }
    ],
    name: "withdrawERC721",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
    signature: "0xc899a86b"
  }
]

export class EthWeb3 {
  static web3: Web3
  static ethersProvider: ethers.providers.Web3Provider
  static signer: ethers.Signer
  static address: string

  static setup = async (provider: any, providerChangedFn: () => void) => {
    if (typeof provider === "undefined") {
      // not dapp browser
      return false
    }

    provider.autoRefreshOnNetworkChange = false

    try {
      await provider.enable() // ask user to connect
    } catch (error) {
      // user rejected it
      return false
    }

    // verify user is on the correct network
    // see also: https://github.com/MetaMask/metamask-extension/issues/3663
    if (provider.networkVersion !== ChainEnv.eth.networkId) {
      // wrong network
      return false
    }

    provider.on("accountsChanged", providerChangedFn)
    provider.on("networkChanged", providerChangedFn)

    EthWeb3.web3 = new Web3(provider)
    EthWeb3.ethersProvider = new ethers.providers.Web3Provider(provider)
    // maybe I need a hack for non metamask provider
    // https://github.com/loomnetwork/loom-js/blob/877edfc6c5a50eb5ce432b5c798026d5cbd60256/src/solidity-helpers.ts#L24
    EthWeb3.signer = EthWeb3.ethersProvider.getSigner()
    EthWeb3.address = await EthWeb3.signer.getAddress()

    return true
  }

  static specialPlanetToken = () => {
    return new EthWeb3.web3.eth.Contract(
      SpecialPlanetTokenABI,
      ChainEnv.ethContractAddresses.SpecialPlanetToken
    )
  }

  static gateway = async () => {
    const address = await EthWeb3.callSpecialPlanetTokenMethod("gateway")
    return new EthWeb3.web3.eth.Contract(GatewayABI, address)
  }

  static callSpecialPlanetTokenMethod = (methodName: string, ...args: Array<any>) => {
    return EthWeb3.callContractMethod(EthWeb3.specialPlanetToken(), methodName, ...args)
  }

  static sendSpecialPlanetTokenMethod = (methodName: string, ...args: Array<any>) => {
    const from = EthWeb3.address
    return EthWeb3.specialPlanetToken()
      .methods[methodName](...args)
      .send({ from })
  }

  static callSpecialPlanetTokenShopMethod = (methodName: string, ...args: Array<any>) => {
    const shop = new EthWeb3.web3.eth.Contract(
      SpecialPlanetTokenShopABI,
      ChainEnv.ethContractAddresses.SpecialPlanetTokenShop
    )
    return EthWeb3.callContractMethod(shop, methodName, ...args)
  }

  static sendSpecialPlanetTokenShopMethod = (methodName: string, wei: string) => {
    const shop = new EthWeb3.web3.eth.Contract(
      SpecialPlanetTokenShopABI,
      ChainEnv.ethContractAddresses.SpecialPlanetTokenShop
    )
    const from = EthWeb3.address
    return shop.methods[methodName]().send({ from, value: wei })
  }

  static callContractMethod = (
    contract: any,
    methodName: string,
    ...args: Array<any>
  ): Promise<any> => {
    const from = EthWeb3.address
    return contract.methods[methodName](...args).call({ from })
  }
}
