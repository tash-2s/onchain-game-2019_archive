const fs = require("fs")
const path = require("path")
const bip39 = require("bip39")
const hdkey = require("ethereumjs-wallet/hdkey")

class MnemonicUtil {
  constructor(prefix) {
    this.prefix = prefix
  }

  generateMnemonicFile() {
    const filePath = this.getFilePath()

    if (fs.existsSync(filePath)) {
      throw new Error("already exists")
    }

    const mnemonic = bip39.generateMnemonic()

    fs.writeFileSync(filePath, mnemonic)
  }

  getMnemonic() {
    const mnemonicPath = this.getFilePath()
    if (!fs.existsSync(mnemonicPath)) {
      throw new Error("mnemonic not found")
    }

    return fs.readFileSync(mnemonicPath, "utf-8")
  }

  getAddressAndPrivateKey() {
    const mnemonic = this.getMnemonic()

    const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(mnemonic))
    const wallet = hdwallet.derivePath("m/44'/60'/0'/0/" + "0").getWallet()

    return {
      address: wallet.getAddressString(),
      privateKey: wallet.getPrivateKey().toString("hex")
    }
  }

  getFilePath() {
    return path.join(__dirname, `${this.prefix}_mnemonic`)
  }
}

module.exports = MnemonicUtil
