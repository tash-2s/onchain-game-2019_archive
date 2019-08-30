const fs = require("fs")
const path = require("path")
const {LocalAddress, CryptoUtils} = require("loom-js")

class PrivateKeyUtil {
  constructor(prefix) {
    this.prefix = prefix
  }

  generatePrivateKeyFile() {
    throw new Error("not implemented yet")
  }

  getPrivateKeyStr() {
    const path = this.getFilePath()
    return fs.readFileSync(path, "utf-8")
  }

  getPublicKeyAndPrivateKey() {
    const privateKey = CryptoUtils.B64ToUint8Array(this.getPrivateKeyStr())
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

    return {publicKey, privateKey}
  }

  getAddress() {
    const publicKey = this.getPublicKeyAndPrivateKey().publicKey
    const address = LocalAddress.fromPublicKey(publicKey).toChecksumString()

    return address
  }

  getFilePath() {
    return path.join(__dirname, `${this.prefix}_private_key`)
  }
}

module.exports = PrivateKeyUtil
