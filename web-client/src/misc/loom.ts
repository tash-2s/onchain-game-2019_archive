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
import UserAbi from "../chain/abi/loom/UserController.json"
import NormalPlanetAbi from "../chain/abi/loom/NormalPlanetController.json"
import RemarkableUserAbi from "../chain/abi/loom/RemarkableUserController.json"

export class LoomWeb3 {
  static isGuest = true
  static web3: Web3
  static web3FromAddress: string
  static mediatorPrivateKey: Uint8Array
  static loginAddress: string

  static setup() {
    const { privateKey, address } = LoomUtil.generateAccount()
    LoomWeb3.mediatorPrivateKey = privateKey
    LoomWeb3.web3 = new Web3(new LoomProvider(LoomUtil.createClient(), privateKey) as any)
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
    const client = LoomUtil.createClient()
    client.txMiddleware = createDefaultTxMiddleware(client, LoomWeb3.mediatorPrivateKey)

    const addressMapper = await Contracts.AddressMapper.createAsync(
      client,
      new Address(client.chainId, LoomWeb3.mediatorLocalAddressInstance())
    )
    if (!(await addressMapper.hasMappingAsync(ethAddressInstance))) {
      await addMappingWithNewLoomAccount(signer)
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
    const oldProvider = LoomWeb3.web3.currentProvider as LoomProvider
    oldProvider.disconnect()
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
    ChainEnv.loomContractAddresses.UserController
  ),
  NormalPlanetController: new LoomWeb3.web3.eth.Contract(
    NormalPlanetAbi,
    ChainEnv.loomContractAddresses.NormalPlanetController
  ),
  RemarkableUserController: new LoomWeb3.web3.eth.Contract(
    RemarkableUserAbi,
    ChainEnv.loomContractAddresses.RemarkableUserController
  )
})

class LoomUtil {
  static createClient() {
    const p = [ChainEnv.loom.chainId, ChainEnv.loom.writeUrl, ChainEnv.loom.readUrl] as const
    return new Client(...p)
  }

  static generateAccount() {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const address = LocalAddress.fromPublicKey(publicKey).toChecksumString()
    return { privateKey, publicKey, address }
  }
}

const addMappingWithNewLoomAccount = async (signer: ethers.Signer) => {
  const ethAddressInstance = new Address(
    "eth",
    LocalAddress.fromHexString(await signer.getAddress())
  )
  const newLoomAccount = LoomUtil.generateAccount()
  const client = LoomUtil.createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, newLoomAccount.privateKey)
  const newLoomAddressInstance = new Address(
    client.chainId,
    LocalAddress.fromPublicKey(newLoomAccount.publicKey)
  )
  const addressMapper = await Contracts.AddressMapper.createAsync(client, newLoomAddressInstance)

  // This is needed before calling addIdentityMappingAsync.
  // Otherwise it throws an error.
  // Weired implementation...
  await addressMapper.hasMappingAsync(ethAddressInstance)

  await addressMapper.addIdentityMappingAsync(
    newLoomAddressInstance,
    ethAddressInstance,
    new EthersSigner(signer)
  )
  client.disconnect()
}

export const callLoomContractMethod = async (
  f: (cs: ReturnType<typeof getLoomContracts>) => any
) => {
  const r = await f(getLoomContracts()).call({ from: LoomWeb3.web3FromAddress })
  console.log(r)
  return r
}

export const sendLoomContractMethod = async (
  f: (cs: ReturnType<typeof getLoomContracts>) => any
) => {
  const r = await f(getLoomContracts()).send({ from: LoomWeb3.web3FromAddress })
  console.log(r)
  return r
}
