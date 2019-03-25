require("ts-node/register")

const { readFileSync } = require("fs")
const path = require("path")
const { join } = require("path")
const LoomTruffleProvider = require("loom-truffle-provider")

module.exports = {
  compilers: {
    solc: {
      version: "0.4.24"
    }
  },
  networks: {
    loom_local: {
      provider: function() {
        const privateKey = readFileSync(path.join(__dirname, "private_key"), "utf-8")
        const chainId = "default"
        const writeUrl = "http://127.0.0.1:46658/rpc"
        const readUrl = "http://127.0.0.1:46658/query"
        const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
        loomTruffleProvider.createExtraAccountsFromMnemonic(
          "gravity top burden flip student usage spell purchase hundred improve check genre",
          10
        )
        return loomTruffleProvider
      },
      network_id: "*"
    },
    loom_extdev_plasma_us1: {
      provider: function() {
        const privateKey = readFileSync(path.join(__dirname, "extdev_private_key"), "utf-8")
        const chainId = "extdev-plasma-us1"
        const writeUrl = "http://extdev-plasma-us1.dappchains.com:80/rpc"
        const readUrl = "http://extdev-plasma-us1.dappchains.com:80/query"
        return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
      },
      network_id: "9545242630824"
    }
  }
}
