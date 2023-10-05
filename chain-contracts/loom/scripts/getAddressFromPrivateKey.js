// ex) node scripts/getAddressFromPrivateKey staging

const PrivateKeyUtil = require("../PrivateKeyUtil.js")

const prefix = process.argv[2]
if (!prefix) {
  throw new Error("prefix not specified")
}

const util = new PrivateKeyUtil(prefix)

console.log(util.getAddress())
