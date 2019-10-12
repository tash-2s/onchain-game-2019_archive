const fs = require("fs")

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

    return `  static ${fnABI.name} = (${args.map(a => `${a}: string`).join(", ")}) => {
    return chains.loom
      .${lowerContractName}()
      .methods.${fnABI.name}(${args.join(", ")})
      .${fnABI.constant ? "call" : "send"}()
  }`
  })

  const body = `import { chains } from "./misc/chains"

export class ${contractName} {
${functionStrings.join("\n\n")}
}
`

  fs.writeFileSync(`./src/${contractName}.ts`, body)
})
