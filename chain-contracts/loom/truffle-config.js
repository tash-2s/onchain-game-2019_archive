require("ts-node/register")

const LoomTruffleProvider = require("loom-truffle-provider")
const PrivateKeyUtil = require("./PrivateKeyUtil.js")

module.exports = {

  plugins: ["truffle-security"],

  compilers: {
    solc: {
      version: "0.5.11",
      settings: {
        optimizer: {
          enabled: true,
          runs: 3000
        }
      }
    }
  },
  networks: {
    local: {
      provider: function() {
        const privateKey = new PrivateKeyUtil("local").getPrivateKeyStr()
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
    extdev: {
      provider: function() {
        const privateKey = new PrivateKeyUtil("extdev").getPrivateKeyStr()
        const chainId = "extdev-plasma-us1"
        const writeUrl = "http://extdev-plasma-us1.dappchains.com:80/rpc"
        const readUrl = "http://extdev-plasma-us1.dappchains.com:80/query"
        return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
      },
      network_id: "9545242630824"
    }
  }
}
