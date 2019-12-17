// usage: node scripts/generateChainData.js [env name]

const fs = require("fs")

const envName = process.argv[2]
// TODO: use envs.json
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
  throw new Error(`undefined envName: ${envName}`)
}

const targetContractAndFunctions = {
  eth: {
    SpecialPlanetToken: [
      "balanceOf",
      "approve",
      "tokensOfOwnerByIndex",
      "gateway",
      "depositToGateway"
    ],
    SpecialPlanetTokenShop: ["price", "mint"]
  },
  loom: {
    HighlightedUserController: ["getUsers"],
    NormalPlanetController: [
      "getPlanets",
      "setPlanets",
      "rankupPlanets",
      "removePlanets",
      "claimInitialGold"
    ],
    SpecialPlanetController: [
      "getPlanets",
      "setPlanet",
      "removePlanet",
      "getPlanetFieldsFromTokenIds"
    ],
    SpecialPlanetToken: [
      "balanceOf",
      "approve",
      "isApprovedForAll",
      "setApprovalForAll",
      "tokensOfOwnerByIndex",
      "gateway"
    ],
    SpecialPlanetTokenLocker: []
  }
}

const loadContracts = () => {
  const contracts = {}

  for (const chainName in targetContractAndFunctions) {
    contracts[chainName] = []
    for (const contractName of Object.keys(targetContractAndFunctions[chainName])) {
      const contract = JSON.parse(
        fs.readFileSync(`../k2-chain-contracts/${chainName}/build/contracts/${contractName}.json`)
      )
      contracts[chainName].push(contract)
    }
  }

  return contracts
}

const generateChainEnv = contracts => {
  const chainEnv = {}

  for (const chainName in contracts) {
    const def = envDef[chainName]
    chainEnv[chainName] = { ...def, contractAddresses: {} }

    for (const contract of contracts[chainName]) {
      chainEnv[chainName].contractAddresses[contract.contractName] =
        contract.networks[def.networkId].address
    }
  }

  fs.writeFileSync(`./chainEnv/${envName}.json`, `${JSON.stringify(chainEnv, null, 2)}\n`)
}

const generateChainClients = contracts => {
  const prettier = require("prettier")

  const solTypeToTsType = (solType, allowNumber) => {
    let t

    if (solType === "bool") {
      t = "boolean"
    } else {
      if (!!allowNumber && /int/.test(solType)) {
        t = "string | number"
      } else {
        t = "string"
      }
    }

    if (solType.slice(-2) === "[]") {
      return `Array<${t}>`
    } else {
      return t
    }
  }

  const upCaseFirstChar = str => str.charAt(0).toUpperCase() + str.slice(1)

  for (const chainName in contracts) {
    for (const contract of contracts[chainName]) {
      const contractName = contract.contractName
      const functionNames = targetContractAndFunctions[chainName][contractName]

      if (functionNames.length < 1) {
        continue
      }

      const functionStrings = contract.abi
        .filter(a => functionNames.includes(a.name))
        .map(fnABI => {
          const argsWithType = (() => {
            let type = fnABI.inputs.map(a => `${a.name}: ${solTypeToTsType(a.type, true)}`)
            if (!fnABI.constant) {
              type.push("txOption?: {}")
            }
            return type.join(", ")
          })()

          const returnType = (() => {
            let type
            if (fnABI.outputs.every(o => o.name === "")) {
              type = fnABI.outputs.map(o => solTypeToTsType(o.type)).join(", ")
            } else {
              type = fnABI.outputs.map((o, i) => `${o.name}: ${solTypeToTsType(o.type)}`).join(", ")
              type = `{ ${type} }`
            }
            return fnABI.constant ? `: Promise<${type}>` : ""
          })()

          const assertIfEth =
            chainName === "loom"
              ? ""
              : 'if (!this.chain.web3 || !this.chain.address) { throw new Error("not logined") }'

          const fromAddress =
            chainName === "loom" ? "this.chain.callerAddress()" : "this.chain.address"

          const args = fnABI.inputs.map(i => i.name).join(", ")

          delete fnABI.signature

          return `
             ${fnABI.name} = (${argsWithType})${returnType} => {
               ${assertIfEth}

               return new this.chain.web3.eth.Contract(
                 [${JSON.stringify(fnABI)}],
                 this.chain.env.contractAddresses.${contractName},
                 { from: ${fromAddress} }
               ).methods
                 .${fnABI.name}(${args})
                 .${fnABI.constant ? "call()" : "send(txOption)"}
             }
          `
        })

      const classString = `
         // generated by scripts/generateChainData.js
         export class ${contractName} {
           constructor(private chain: import("../../${chainName}").${upCaseFirstChar(chainName)}) {}
           ${functionStrings.join("\n")}
         }
      `

      const pOptions = prettier.resolveConfig.sync(".")
      const formatted = prettier.format(classString, { ...pOptions, parser: "typescript" })
      fs.writeFileSync(`./src/chain/clients/${chainName}/${contractName}.ts`, formatted)
    }
  }
}

const contracts = loadContracts()
generateChainEnv(contracts)
generateChainClients(contracts)
