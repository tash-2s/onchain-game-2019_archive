// usage: node scripts/generateChainEnv.js [env name]

const envName = process.argv[2]
const envDefs = {
  local: {
    writeUrl: "ws://127.0.0.1:46658/websocket",
    readUrl: "ws://127.0.0.1:46658/queryws",
    chainId: "default",
    networkId: "13654820909954"
  },
  extdev_plasma_us1: {
    writeUrl: "wss://extdev-plasma-us1.dappchains.com/websocket",
    readUrl: "wss://extdev-plasma-us1.dappchains.com/queryws",
    chainId: "extdev-plasma-us1",
    networkId: "9545242630824"
  }
}

const envDef = envDefs[envName]
if (!envDef) {
  console.error(`undefined envName: ${envName}`)
  throw new Error()
}

const fs = require("fs")
const JSON_PATH = "../k2-loomchain/build/contracts/"
const contractsAddresses = {} // TODO: save k2-loomchain's commit hash too
fs.readdirSync(JSON_PATH).forEach(fileName => {
  const contractName = fileName.replace(".json", "")

  if (contractName.slice(-10) !== "Controller") {
    return
  }

  if (contractName.slice(-15) === "DebugController") {
    return
  }

  const file = fs.readFileSync(JSON_PATH + fileName)
  const parsedJson = JSON.parse(file)

  fs.writeFileSync(`./src/chain/abi/${contractName}.json`, JSON.stringify(parsedJson.abi, null, 2))
  contractsAddresses[contractName] = parsedJson.networks[envDef.networkId].address
})

const chainEnv = Object.assign(envDef, { contractsAddresses })
fs.writeFileSync(`./chainEnv/${envName}.json`, JSON.stringify(chainEnv, null, 2))
