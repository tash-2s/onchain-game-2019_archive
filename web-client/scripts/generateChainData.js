// usage: node scripts/generateChainData.js [env name]

const fs = require("fs")

const envName = process.argv[2]
const envDefs = {
  local: {
    loom: {
      writeUrl: "ws://127.0.0.1:46658/websocket",
      readUrl: "ws://127.0.0.1:46658/queryws",
      chainId: "default",
      networkId: "13654820909954"
    },
    eth: {
      networkId: "5777"
    }
  },
  staging: {
    loom: {
      writeUrl: "wss://extdev-plasma-us1.dappchains.com/websocket",
      readUrl: "wss://extdev-plasma-us1.dappchains.com/queryws",
      chainId: "extdev-plasma-us1",
      networkId: "9545242630824"
    },
    eth: {
      networkId: "4"
    }
  }
}

const envDef = envDefs[envName]
if (!envDef) {
  console.error(`undefined envName: ${envName}`)
  throw new Error()
}

const LOOM_JSON_PATH = "../k2-chain-contracts/loom/build/contracts/"
const loomContractAddresses = {} // TODO: save k2-chain-contracts's commit hash too
fs.readdirSync(LOOM_JSON_PATH).forEach(fileName => {
  const contractName = fileName.replace(".json", "")

  if (contractName !== "SpecialPlanetToken") {
    if (contractName.slice(-10) !== "Controller") {
      return
    }

    if (contractName.slice(-15) === "DebugController") {
      return
    }
  }

  const file = fs.readFileSync(LOOM_JSON_PATH + fileName)
  const parsedJson = JSON.parse(file)

  fs.writeFileSync(
    `./src/chain/abi/loom/${contractName}.json`,
    JSON.stringify(parsedJson.abi, null, 2)
  )
  loomContractAddresses[contractName] = parsedJson.networks[envDef.loom.networkId].address
})

const ETH_JSON_PATH = "../k2-chain-contracts/eth/build/contracts/"
const ethContractAddresses = {}
fs.readdirSync(ETH_JSON_PATH).forEach(fileName => {
  const contractName = fileName.replace(".json", "")

  if (contractName !== "SpecialPlanetToken") {
    return
  }

  const file = fs.readFileSync(ETH_JSON_PATH + fileName)
  const parsedJson = JSON.parse(file)

  fs.writeFileSync(
    `./src/chain/abi/eth/${contractName}.json`,
    JSON.stringify(parsedJson.abi, null, 2)
  )
  ethContractAddresses[contractName] = parsedJson.networks[envDef.eth.networkId].address
})

const chainEnv = Object.assign(envDef, { loomContractAddresses, ethContractAddresses })
fs.writeFileSync(`./chainEnv/${envName}.json`, JSON.stringify(chainEnv, null, 2))
