// ex) node scripts/generateMnemonicFile.js staging

const MnemonicUtil = require("../MnemonicUtil.js")

const prefix = process.argv[2]
if (!prefix) {
  throw new Error("prefix not specified")
}

new MnemonicUtil(prefix).generateMnemonicFile()
