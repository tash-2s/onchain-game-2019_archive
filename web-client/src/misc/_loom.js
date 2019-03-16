import { Client, LocalAddress, CryptoUtils, LoomProvider } from "loom-js"
import Web3 from "web3"
import ChainEnv from "../chain/env.json"
import WebAbi from "../chain/abi/Web.json"
import LogicAbi from "../chain/abi/Logic.json"
import RemarkableUsersAbi from "../chain/abi/RemarkableUsers.json"

export class LoomWeb3 {
  static setup() {
    let privateKey = LoomKeyStorage.readPrivateKey()
    if (privateKey) {
      this.isGuest = false
    } else {
      privateKey = new Uint8Array(new Array(64).fill(0)) // guest
      this.isGuest = true
    }

    this.accountAddress = LoomUtil.getAddressFromPrivateKey(privateKey)
    this.web3 = new Web3(new LoomProvider(LoomUtil.getClient(), privateKey))
  }

  static resetWithNewAccount() {
    const [privateKey, _, address] = LoomUtil.generateAccount()
    LoomKeyStorage.writePrivateKey(privateKey)
    this.isGuest = false
    this.accountAddress = address
    this.web3 = new Web3(new LoomProvider(LoomUtil.getClient(), privateKey))

    return address
  }
}

export const getLoomContracts = () => ({
  Logic: new LoomWeb3.web3.eth.Contract(LogicAbi, ChainEnv.contractsAddresses.Logic),
  Web: new LoomWeb3.web3.eth.Contract(WebAbi, ChainEnv.contractsAddresses.Web),
  RemarkableUsers: new LoomWeb3.web3.eth.Contract(
    RemarkableUsersAbi,
    ChainEnv.contractsAddresses.RemarkableUsers
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

  static writePrivateKey(privateKey) {
    localStorage.setItem(PRIVATE_KEY_NAME, Buffer.from(privateKey).toString("hex"))
  }
}

class LoomUtil {
  static getClient() {
    const p = [ChainEnv.chainId, ChainEnv.writeUrl, ChainEnv.readUrl]
    console.log(...p)
    return new Client(...p)
  }

  static getAddressFromPrivateKey(privateKey) {
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    return LocalAddress.fromPublicKey(publicKey).toChecksumString()
  }

  static generateAccount() {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const address = LocalAddress.fromPublicKey(publicKey).toChecksumString()
    return [privateKey, publicKey, address]
  }
}
