const fs = require("fs")
const LoomTruffleProvider = require("loom-truffle-provider")
const PrivateKeyUtil = require("./PrivateKeyUtil.js")

const envs = JSON.parse(fs.readFileSync("../envs.json"))

module.exports = {
  compilers: {
    solc: {
      version: "0.5.13",
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
        const chainId = envs.local.loom.chainId
        const writeUrl = envs.local.loom.writeUrl
        const readUrl = envs.local.loom.readUrl
        const loomTruffleProvider = new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
        loomTruffleProvider.createExtraAccountsFromMnemonic(
          "gravity top burden flip student usage spell purchase hundred improve check genre",
          10
        )
        return loomTruffleProvider
      },
      network_id: envs.local.loom.networkId
    },
    staging: {
      provider: function() {
        const privateKey = new PrivateKeyUtil("staging").getPrivateKeyStr()
        const chainId = envs.staging.loom.chainId
        const writeUrl = envs.staging.loom.writeUrl
        const readUrl = envs.staging.loom.readUrl
        return new LoomTruffleProvider(chainId, writeUrl, readUrl, privateKey)
      },
      network_id: envs.staging.loom.networkId
    }
  },
  mocha: {
    timeout: 5000
  }
}
