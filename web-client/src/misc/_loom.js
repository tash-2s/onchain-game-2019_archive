import { Client, LocalAddress, CryptoUtils, LoomProvider } from "loom-js"
import Web3 from "web3"
import TestNFTJson from "../contracts/TestNFT.json"

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

export const getLoomContracts = () => {
  const networkAddress = Object.values(TestNFTJson.networks)[0]["address"]
  const testNFT = new LoomWeb3.web3.eth.Contract(
    TestNFTJson.abi,
    networkAddress
  )

  return { testNFT }
}

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
    localStorage.setItem(
      PRIVATE_KEY_NAME,
      Buffer.from(privateKey).toString("hex")
    )
  }
}

class LoomUtil {
  static getClient() {
    const networkId = "default"
    const writeUrl = "ws://127.0.0.1:46658/websocket"
    const readUrl = "ws://127.0.0.1:46658/queryws"
    return new Client(networkId, writeUrl, readUrl)
  }

  static getAddressFromPrivateKey(privateKey) {
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    return LocalAddress.fromPublicKey(publicKey).toString()
  }

  static generateAccount() {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const address = LocalAddress.fromPublicKey(publicKey).toString()
    return [privateKey, publicKey, address]
  }
}
