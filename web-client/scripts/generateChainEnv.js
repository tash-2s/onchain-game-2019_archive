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
    writeUrl: "ws://extdev-plasma-us1.dappchains.com:80/websocket",
    readUrl: "ws://extdev-plasma-us1.dappchains.com:80/queryws",
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
const obj = {}
fs.readdirSync(JSON_PATH).forEach(fileName => {
  if (fileName === "Migrations.json") {
    return
  }

  const file = fs.readFileSync(JSON_PATH + fileName)
  if (file.toString().match(/"contractKind": "library"/)) {
    return // skip libs
  }

  const json = JSON.parse(file)
  if (!Object.keys(json.networks).length) {
    return // skip externals, like contracts of openzeppelin
  }

  obj[fileName.replace(".json", "")] = {
    address: json.networks[envDef.networkId].address,
    abi: json.abi
  }
})

const data = Object.assign(envDef, { contracts: obj })
fs.writeFileSync(`./chainEnv/${envName}.json`, JSON.stringify(data, null, 2))
