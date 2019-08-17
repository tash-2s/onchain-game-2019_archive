// ex) node scripts/getAddressFromPrivateKey extdev

const fs = require("fs")
const path = require("path")

const { LocalAddress, CryptoUtils } = require("loom-js")

const prefix = process.argv[2]
if (!prefix) {
  throw new Error("prefix not specified")
}

const privateKeyStr = fs.readFileSync(path.join(__dirname, `../${prefix}_private_key`), "utf-8")
const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr)
const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)

const address = LocalAddress.fromPublicKey(publicKey).toChecksumString()

console.log(address)
