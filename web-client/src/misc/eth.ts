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

export class Eth {
  web3: Web3 | null
  ethersProvider: ethers.providers.Web3Provider | null
  address: string | null

  constructor() {
    this.web3 = null
    this.ethersProvider = null
    this.address = null
  }

  login = async (provider: any, providerChangedFn: () => void) => {
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

    this.web3 = new Web3(provider)
    this.ethersProvider = new ethers.providers.Web3Provider(provider)
    this.address = await this.signer().getAddress()

    return true
  }

  signer = () => {
    // maybe I need a hack for non metamask provider
    // https://github.com/loomnetwork/loom-js/blob/877edfc6c5a50eb5ce432b5c798026d5cbd60256/src/solidity-helpers.ts#L24
    if (!this.ethersProvider) {
      throw new Error("not logined")
    }
    return this.ethersProvider.getSigner()
  }

  specialPlanetToken = () => {
    if (!this.web3 || !this.address) {
      throw new Error("not logined")
    }

    return new this.web3.eth.Contract(
      SpecialPlanetTokenABI,
      ChainEnv.ethContractAddresses.SpecialPlanetToken,
      { from: this.address }
    )
  }

  specialPlanetTokenShop = () => {
    if (!this.web3 || !this.address) {
      throw new Error("not logined")
    }

    return new this.web3.eth.Contract(
      SpecialPlanetTokenShopABI,
      ChainEnv.ethContractAddresses.SpecialPlanetTokenShop,
      { from: this.address }
    )
  }

  gateway = async () => {
    if (!this.web3 || !this.address) {
      throw new Error("not logined")
    }

    const address = await this.specialPlanetToken()
      .methods.gateway()
      .call()
    return new this.web3.eth.Contract(GatewayABI, address, { from: this.address })
  }
}
