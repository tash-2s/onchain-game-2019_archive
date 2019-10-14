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
      "tokensOfOwnerByIndex"
    ],
    UserController: ["getUser"]
  },
  eth: {
    SpecialPlanetToken: ["approve", "tokensOfOwnerByIndex", "gateway", "depositToGateway"],
    SpecialPlanetTokenShop: ["price", "sell"]
  }
}

Object.keys(def).forEach(chainName => {
  Object.keys(def[chainName]).forEach(contractName => {
    const functionNames = def[chainName][contractName]

    const ABI = JSON.parse(fs.readFileSync(`./.abi/${chainName}/${contractName}.json`))

    const functionStrings = ABI.filter(a => functionNames.includes(a.name)).map(fnABI => {
      const args = fnABI.inputs.map(i => i.name).join(", ")
      const argsWithType = fnABI.inputs.map(
        a => `${a.name}: ${a.type.slice(-2) === "[]" ? "Array<string>" : "string"}`
      )
      if (!fnABI.constant) {
        argsWithType.push("txOption?: {}")
      }
      const _types = fnABI.outputs
        .map(
          (o, i) =>
            `${o.name === "" ? `${i}` : o.name}: ${
              o.type.slice(-2) === "[]" ? "Array<string>" : "string"
            }`
        )
        .join(", ")
      const returnType = fnABI.constant ? `: Promise<{ ${_types} }>` : ""

      return `
  static ${fnABI.name} = (${argsWithType.join(", ")})${returnType} => {
    ${
      chainName === "loom"
        ? ""
        : 'if (!chains.eth.web3 || !chains.eth.address) { throw new Error("not logined") }'
    }
    return new chains.${chainName}.web3.eth.Contract(
      [${JSON.stringify(fnABI)}],
      ChainEnv.${chainName}ContractAddresses.${contractName},
      { from: ${chainName === "loom" ? "chains.loom.callerAddress()" : "chains.eth.address"} }
    ).methods
      .${fnABI.name}(${args})
      .${fnABI.constant ? "call()" : "send(txOption)"}
  }
  `
    })

    const body = `
  import { chains } from "../../../misc/chains"
  import ChainEnv from "../../../chain/env.json"

  export class ${contractName} {
  ${functionStrings.join("\n")}
  }
  `

    const options = prettier.resolveConfig.sync(".")
    const formatted = prettier.format(body, { ...options, parser: "typescript" })
    fs.writeFileSync(`./src/chain/clients/${chainName}/${contractName}.ts`, formatted)
  })
})
