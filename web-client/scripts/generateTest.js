const fs = require("fs")
const prettier = require("prettier")

const def = {
  SpecialPlanetController: [
    "getPlanets",
    "setPlanet",
    "removePlanet",
    "getPlanetFieldsFromTokenIds"
  ]
}

Object.keys(def).forEach(contractName => {
  const functionNames = def[contractName]

  const ABI = JSON.parse(fs.readFileSync(`./src/chain/abi/loom/${contractName}.json`))

  const functionStrings = ABI.filter(a => functionNames.includes(a.name)).map(fnABI => {
    const args = fnABI.inputs.map(i => i.name).join(", ")
    const argsWithType = fnABI.inputs
      .map(a => `${a.name}: ${a.type.slice(-2) === "[]" ? "Array<string>" : "string"}`)
      .join(", ")
    const _types = fnABI.outputs
      .map(o => `${o.name}: ${o.type.slice(-2) === "[]" ? "Array<string>" : "string"}`)
      .join(", ")
    const returnType = fnABI.constant ? `Promise<{ ${_types} }>` : "Promise<any>"

    return `
static ${fnABI.name} = (${argsWithType}): ${returnType} => {
  return new chains.loom.web3.eth.Contract(
    [${JSON.stringify(fnABI)}],
    ChainEnv.loomContractAddresses.${contractName}
  ).methods
    .${fnABI.name}(${args})
    .${fnABI.constant ? "call" : "send"}({ from: chains.loom.callerAddress() })
}
`
  })

  const body = `
import { chains } from "./misc/chains"
import ChainEnv from "./chain/env.json"

export class ${contractName} {
${functionStrings.join("\n")}
}
`

  const options = prettier.resolveConfig.sync(".")
  const formatted = prettier.format(body, { ...options, parser: "typescript" })
  fs.writeFileSync(`./src/${contractName}.ts`, formatted)
})
