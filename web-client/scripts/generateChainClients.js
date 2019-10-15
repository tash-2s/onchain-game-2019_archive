const fs = require("fs")
const prettier = require("prettier")

const def = {
  loom: {
    HighlightedUserController: ["getUsers"],
    NormalPlanetController: ["setPlanet", "rankupPlanet", "removePlanet"],
    SpecialPlanetController: [
      "getPlanets",
      "setPlanet",
      "removePlanet",
      "getPlanetFieldsFromTokenIds"
    ],
    SpecialPlanetToken: [
      "approve",
      "isApprovedForAll",
      "setApprovalForAll",
      "tokensOfOwnerByIndex",
      "gateway"
    ],
    UserController: ["getUser"]
  },
  eth: {
    SpecialPlanetToken: ["approve", "tokensOfOwnerByIndex", "gateway", "depositToGateway"],
    SpecialPlanetTokenShop: ["price", "sell"]
  }
}

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

Object.keys(def).forEach(chainName => {
  Object.keys(def[chainName]).forEach(contractName => {
    const functionNames = def[chainName][contractName]

    const ABI = JSON.parse(fs.readFileSync(`./.abi/${chainName}/${contractName}.json`))

    const functionStrings = ABI.filter(a => functionNames.includes(a.name)).map(fnABI => {
      const args = fnABI.inputs.map(i => i.name).join(", ")
      const argsWithType = fnABI.inputs.map(a => `${a.name}: ${solTypeToTsType(a.type, true)}`)
      if (!fnABI.constant) {
        argsWithType.push("txOption?: {}")
      }
      let _types = fnABI.outputs.map((o, i) => `${o.name}: ${solTypeToTsType(o.type)}`).join(", ")
      _types = `{ ${_types} }`
      if (fnABI.outputs.every(o => o.name === "")) {
        _types = fnABI.outputs.map(o => solTypeToTsType(o.type)).join(", ")
      }
      const returnType = fnABI.constant ? `: Promise<${_types}>` : ""

      return `
  static ${fnABI.name} = (${argsWithType.join(", ")})${returnType} => {
    ${
      chainName === "loom"
        ? ""
        : 'if (!chains.eth.web3 || !chains.eth.address) { throw new Error("not logined") }'
    }
    return new chains.${chainName}.web3.eth.Contract(
      [${JSON.stringify(fnABI)}],
      chains.${chainName}.env.contractAddresses.${contractName},
      { from: ${chainName === "loom" ? "chains.loom.callerAddress()" : "chains.eth.address"} }
    ).methods
      .${fnABI.name}(${args})
      .${fnABI.constant ? "call()" : "send(txOption)"}
  }
  `
    })

    const body = `
  import { chains } from "../../../misc/chains"

  export class ${contractName} {
  ${functionStrings.join("\n")}
  }
  `

    const options = prettier.resolveConfig.sync(".")
    const formatted = prettier.format(body, { ...options, parser: "typescript" })
    fs.writeFileSync(`./src/chain/clients/${chainName}/${contractName}.ts`, formatted)
  })
})
