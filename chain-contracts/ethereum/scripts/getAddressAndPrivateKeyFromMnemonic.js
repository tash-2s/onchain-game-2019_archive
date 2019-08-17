const MnemonicUtil = require("../MnemonicUtil.js")

const prefix = process.argv[2]
if (!prefix) {
  throw new Error("prefix not specified")
}

const { address, privateKey } = new MnemonicUtil(prefix).getAddressAndPrivateKey()

console.log(address)
console.log(privateKey)
