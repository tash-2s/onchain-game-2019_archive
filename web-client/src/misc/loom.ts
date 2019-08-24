import {
  Client,
  Address,
  LocalAddress,
  CryptoUtils,
  LoomProvider,
  Contracts,
  EthersSigner,
  createDefaultTxMiddleware,
  NonceTxMiddleware,
  SignedEthTxMiddleware
} from "loom-js"
import Web3 from "web3"
import { ethers } from "ethers"

import ChainEnv from "../chain/env.json"
import UserAbi from "../chain/abi/UserController.json"
import NormalPlanetAbi from "../chain/abi/NormalPlanetController.json"
import RemarkableUserAbi from "../chain/abi/RemarkableUserController.json"

export class LoomWeb3 {
  static isGuest = true
  static web3: Web3
  static web3FromAddress: string
  static mediatorPrivateKey: Uint8Array
  static loginAddress: string

  static setup() {
    const { privateKey, address } = LoomUtil.generateAccount()
    LoomWeb3.mediatorPrivateKey = privateKey
    LoomWeb3.web3 = new Web3(new LoomProvider(LoomUtil.getClient(), privateKey) as any)
    LoomWeb3.web3FromAddress = address
  }

  static mediatorPublicKey() {
    return CryptoUtils.publicKeyFromPrivateKey(LoomWeb3.mediatorPrivateKey)
  }

  static mediatorLocalAddressInstance() {
    return LocalAddress.fromPublicKey(LoomWeb3.mediatorPublicKey())
  }

  static mediatorAddress() {
    return LoomWeb3.mediatorLocalAddressInstance().toChecksumString()
  }

  static async loginWithEth(signer: ethers.Signer) {
    const ethAddress = await signer.getAddress()

    const ethAddressInstance = new Address("eth", LocalAddress.fromHexString(ethAddress))
    const client = LoomUtil.getClient()
    client.txMiddleware = createDefaultTxMiddleware(client, LoomWeb3.mediatorPrivateKey)

    const addressMapper = await Contracts.AddressMapper.createAsync(
      client,
      new Address(client.chainId, LoomWeb3.mediatorLocalAddressInstance())
    )
    if (!(await addressMapper.hasMappingAsync(ethAddressInstance))) {
      await addressMapper.addIdentityMappingAsync(
        new Address(client.chainId, LocalAddress.fromHexString(LoomUtil.generateAccount().address)),
        ethAddressInstance,
        new EthersSigner(signer)
      )
    }
    const mapping = await addressMapper.getMappingAsync(ethAddressInstance)
    console.log(
      `eth: ${mapping.from.local.toChecksumString()}, loom: ${mapping.to.local.toChecksumString()}`
    )
    LoomWeb3.loginAddress = mapping.to.local.toChecksumString()

    const loomProvider = new LoomProvider(client, LoomWeb3.mediatorPrivateKey)
    loomProvider.callerChainId = "eth"
    loomProvider.setMiddlewaresForAddress(ethAddressInstance.local.toString(), [
      new NonceTxMiddleware(ethAddressInstance, client),
      new SignedEthTxMiddleware(signer)
    ])

    const newWeb3 = new Web3(loomProvider)
    LoomWeb3.web3 = newWeb3
    LoomWeb3.web3FromAddress = ethAddress
    LoomWeb3.isGuest = false

    return LoomWeb3.loginAddress
  }

  static async getLoomTime() {
    const o = await LoomWeb3.web3.eth.getBlock("latest")
    return o.timestamp
  }
}

const getLoomContracts = () => ({
  UserController: new LoomWeb3.web3.eth.Contract(
    UserAbi,
    ChainEnv.contractsAddresses.UserController
  ),
  NormalPlanetController: new LoomWeb3.web3.eth.Contract(
    NormalPlanetAbi,
    ChainEnv.contractsAddresses.NormalPlanetController
  ),
  RemarkableUserController: new LoomWeb3.web3.eth.Contract(
    RemarkableUserAbi,
    ChainEnv.contractsAddresses.RemarkableUserController
  )
})

class LoomUtil {
  static getClient() {
    const p = [ChainEnv.chainId, ChainEnv.writeUrl, ChainEnv.readUrl] as const
    console.log(...p)
    return new Client(...p)
  }

  static getAddressFromPrivateKey(privateKey: Uint8Array) {
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    return LocalAddress.fromPublicKey(publicKey).toChecksumString()
  }

  static generateAccount() {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const address = LocalAddress.fromPublicKey(publicKey).toChecksumString()
    return { privateKey, publicKey, address }
  }
}

export const callLoomContractMethod = async (
  f: (cs: ReturnType<typeof getLoomContracts>) => any
) => {
  console.time("call-loom")

  const r = await f(getLoomContracts()).call({ from: LoomWeb3.web3FromAddress })

  console.timeEnd("call-loom")
  console.log(r)

  return r
}

export const sendLoomContractMethod = async (
  f: (cs: ReturnType<typeof getLoomContracts>) => any
) => {
  console.time("send-loom")

  const r = await f(getLoomContracts()).send({ from: LoomWeb3.web3FromAddress })

  console.timeEnd("send-loom")
  console.log(r)

  return r
}
