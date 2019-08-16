// ex) node scripts/generateMnemonic.js rinkeby

const fs = require("fs")
const path = require("path")
const bip39 = require("bip39")
const HDWalletProvider = require("truffle-hdwallet-provider")

const prefix = process.argv[2]

if (!prefix) {
  throw new Error("prefix not specified")
}

const filePath = path.join(__dirname, `../${prefix}_mnemonic`)

if (fs.existsSync(filePath)) {
  throw new Error("already exists")
}

const mnemonic = bip39.generateMnemonic()

fs.writeFileSync(filePath, mnemonic)

console.log(new HDWalletProvider(mnemonic, `https://dummy`).getAddress(0))
