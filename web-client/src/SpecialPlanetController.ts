import { chains } from "./misc/chains"
import ChainEnv from "./chain/env.json"

export class SpecialPlanetController {
  static getPlanets = (
    account: string
  ): Promise<{
    confirmedGold: string
    goldConfirmedAt: string
    ids: Array<string>
    kinds: Array<string>
    paramRates: Array<string>
    times: Array<string>
    axialCoordinates: Array<string>
    artSeeds: Array<string>
  }> => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: true,
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "getPlanets",
          outputs: [
            { internalType: "uint200", name: "confirmedGold", type: "uint200" },
            { internalType: "uint32", name: "goldConfirmedAt", type: "uint32" },
            { internalType: "uint24[]", name: "ids", type: "uint24[]" },
            { internalType: "uint8[]", name: "kinds", type: "uint8[]" },
            { internalType: "uint8[]", name: "paramRates", type: "uint8[]" },
            { internalType: "uint32[]", name: "times", type: "uint32[]" },
            { internalType: "int16[]", name: "axialCoordinates", type: "int16[]" },
            { internalType: "uint64[]", name: "artSeeds", type: "uint64[]" }
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
          signature: "0x2e49cca0"
        }
      ],
      ChainEnv.loomContractAddresses.SpecialPlanetController
    ).methods
      .getPlanets(account)
      .call({ from: chains.loom.callerAddress() })
  }

  static setPlanet = (
    tokenId: string,
    axialCoordinateQ: string,
    axialCoordinateR: string
  ): Promise<any> => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [
            { internalType: "uint256", name: "tokenId", type: "uint256" },
            { internalType: "int16", name: "axialCoordinateQ", type: "int16" },
            { internalType: "int16", name: "axialCoordinateR", type: "int16" }
          ],
          name: "setPlanet",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
          signature: "0x7ecdce7e"
        }
      ],
      ChainEnv.loomContractAddresses.SpecialPlanetController
    ).methods
      .setPlanet(tokenId, axialCoordinateQ, axialCoordinateR)
      .send({ from: chains.loom.callerAddress() })
  }

  static removePlanet = (shortId: string): Promise<any> => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [{ internalType: "uint24", name: "shortId", type: "uint24" }],
          name: "removePlanet",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
          signature: "0xff000261"
        }
      ],
      ChainEnv.loomContractAddresses.SpecialPlanetController
    ).methods
      .removePlanet(shortId)
      .send({ from: chains.loom.callerAddress() })
  }

  static getPlanetFieldsFromTokenIds = (
    tokenIds: Array<string>
  ): Promise<{
    shortIds: Array<string>
    versions: Array<string>
    kinds: Array<string>
    paramRates: Array<string>
    artSeeds: Array<string>
  }> => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: true,
          inputs: [{ internalType: "uint256[]", name: "tokenIds", type: "uint256[]" }],
          name: "getPlanetFieldsFromTokenIds",
          outputs: [
            { internalType: "uint24[]", name: "shortIds", type: "uint24[]" },
            { internalType: "uint8[]", name: "versions", type: "uint8[]" },
            { internalType: "uint8[]", name: "kinds", type: "uint8[]" },
            { internalType: "uint8[]", name: "paramRates", type: "uint8[]" },
            { internalType: "uint64[]", name: "artSeeds", type: "uint64[]" }
          ],
          payable: false,
          stateMutability: "pure",
          type: "function",
          signature: "0xf934e1ef"
        }
      ],
      ChainEnv.loomContractAddresses.SpecialPlanetController
    ).methods
      .getPlanetFieldsFromTokenIds(tokenIds)
      .call({ from: chains.loom.callerAddress() })
  }
}
