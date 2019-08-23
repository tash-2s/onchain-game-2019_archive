import { Client, LocalAddress, CryptoUtils, LoomProvider } from "loom-js"
import Web3 from "web3"
import ChainEnv from "../chain/env.json"
import UserAbi from "../chain/abi/UserController.json"
import NormalPlanetAbi from "../chain/abi/NormalPlanetController.json"
import RemarkableUserAbi from "../chain/abi/RemarkableUserController.json"

export class LoomWeb3 {
  static isGuest: boolean
  static web3: Web3
  static accountAddress: string

  static setup() {
    let privateKey = LoomKeyStorage.readPrivateKey()
    if (privateKey) {
      LoomWeb3.isGuest = false
    } else {
      privateKey = new Uint8Array(new Array(64).fill(0)) // guest
      LoomWeb3.isGuest = true
    }

    LoomWeb3.accountAddress = LoomUtil.getAddressFromPrivateKey(privateKey)
    LoomWeb3.web3 = new Web3(new LoomProvider(LoomUtil.getClient(), privateKey) as any)
  }

  static resetWithNewAccount() {
    const [privateKey, _, address] = LoomUtil.generateAccount()
    LoomKeyStorage.writePrivateKey(privateKey)
    LoomWeb3.isGuest = false
    LoomWeb3.accountAddress = address
    LoomWeb3.web3 = new Web3(new LoomProvider(LoomUtil.getClient(), privateKey) as any)

    return address
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

const PRIVATE_KEY_NAME = "privateKey"
class LoomKeyStorage {
  static readPrivateKey() {
    const privateKeyString = localStorage.getItem(PRIVATE_KEY_NAME)

    if (privateKeyString) {
      return Uint8Array.from(Buffer.from(privateKeyString, "hex")) // TODO: right?
    } else {
      return false
    }
  }

  static writePrivateKey(privateKey: Uint8Array) {
    localStorage.setItem(PRIVATE_KEY_NAME, Buffer.from(privateKey).toString("hex"))
  }
}

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
    return [privateKey, publicKey, address] as const
  }
}

export const callLoomContractMethod = async (
  f: (cs: ReturnType<typeof getLoomContracts>) => any
) => {
  console.time("call-loom")

  const r = await f(getLoomContracts()).call({ from: LoomWeb3.accountAddress })

  console.timeEnd("call-loom")
  console.log(r)

  return r
}

export const sendLoomContractMethod = async (
  f: (cs: ReturnType<typeof getLoomContracts>) => any
) => {
  console.time("send-loom")

  const r = await f(getLoomContracts()).send({ from: LoomWeb3.accountAddress })

  console.timeEnd("send-loom")
  console.log(r)

  return r
}
