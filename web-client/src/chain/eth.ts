import Web3 from "web3"
import { ethers } from "ethers"
import { createEthereumGatewayAsync, getMetamaskSigner } from "loom-js"

import ChainEnv from "../chain/env.json"

import { IWithdrawalReceipt } from "loom-js/dist/contracts/transfer-gateway"

type Env = typeof ChainEnv["eth"]

export class Eth {
  web3: Web3 | null
  address: string | null
  env: Env

  constructor() {
    this.web3 = null
    this.address = null
    this.env = ChainEnv.eth
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
    if (provider.networkVersion !== this.env.networkId) {
      // wrong network
      return false
    }

    provider.on("accountsChanged", providerChangedFn)
    provider.on("networkChanged", providerChangedFn)

    this.web3 = new Web3(provider)
    this.address = await this.signer().getAddress()

    return true
  }

  signer = () => {
    if (!this.web3) {
      throw new Error("not logined")
    }
    return getMetamaskSigner(this.web3.currentProvider)
  }

  withdrawFromGateway = async (receipt: IWithdrawalReceipt, gatewayAddress: string) => {
    if (!this.web3) {
      throw new Error("not logined")
    }
    const gatewayVersion = await getGatewayVersion(this.web3)
    const ethereumGatewayContract = await createEthereumGatewayAsync(
      gatewayVersion,
      gatewayAddress,
      this.signer()
    )
    const tx = await ethereumGatewayContract.withdrawAsync(receipt)
    if (!tx.hash) {
      throw new Error("this should not happen")
    }
    return tx.hash
  }
}

const getGatewayVersion = async (web3: Web3) => {
  const networkId = await web3.eth.net.getId()

  switch (networkId) {
    case 1: // Mainnet
      return 1
    case 4: // Rinkeby
      return 2
    default:
      throw new Error("Ethereum Gateway is not deployed on network " + networkId)
  }
}
