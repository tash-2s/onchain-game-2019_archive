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
  const lowerContractName = contractName.charAt(0).toLowerCase() + contractName.slice(1)

  const functionStrings = ABI.filter(a => functionNames.includes(a.name)).map(fnABI => {
    const args = fnABI.inputs.map(i => i.name)
    const argsWithType = args.map(a => `${a}: string`).join(", ")
    const _types = fnABI.outputs
      .map(o => `${o.name}: ${o.type.slice(-2) === "[]" ? "Array<string>" : "string"}`)
      .join(", ")
    const returnType = fnABI.constant ? `Promise<{ ${_types} }>` : "Promise<any>"

    return `
static ${fnABI.name} = (${argsWithType}): ${returnType} => {
  return chains.loom
    .${lowerContractName}()
    .methods.${fnABI.name}(${args.join(", ")})
    .${fnABI.constant ? "call" : "send"}()
}
`
  })

  const body = `
import { chains } from "./misc/chains"

export class ${contractName} {
${functionStrings.join("\n")}
}
`

  const options = prettier.resolveConfig.sync(".")
  const formatted = prettier.format(body, { ...options, parser: "typescript" })
  fs.writeFileSync(`./src/${contractName}.ts`, formatted)
})
