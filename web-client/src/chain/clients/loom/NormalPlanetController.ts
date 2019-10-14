import { chains } from "../../../misc/chains"
import ChainEnv from "../../../chain/env.json"

export class NormalPlanetController {
  static setPlanet = (
    planetId: string,
    axialCoordinateQ: string,
    axialCoordinateR: string
  ): Promise<any> => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [
            { internalType: "uint16", name: "planetId", type: "uint16" },
            { internalType: "int16", name: "axialCoordinateQ", type: "int16" },
            { internalType: "int16", name: "axialCoordinateR", type: "int16" }
          ],
          name: "setPlanet",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
          signature: "0x1866e1ff"
        }
      ],
      ChainEnv.loomContractAddresses.NormalPlanetController,
      { from: chains.loom.callerAddress() }
    ).methods
      .setPlanet(planetId, axialCoordinateQ, axialCoordinateR)
      .send()
  }

  static rankupPlanet = (userNormalPlanetId: string, targetRank: string): Promise<any> => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [
            { internalType: "uint64", name: "userNormalPlanetId", type: "uint64" },
            { internalType: "uint8", name: "targetRank", type: "uint8" }
          ],
          name: "rankupPlanet",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
          signature: "0x2db45a59"
        }
      ],
      ChainEnv.loomContractAddresses.NormalPlanetController,
      { from: chains.loom.callerAddress() }
    ).methods
      .rankupPlanet(userNormalPlanetId, targetRank)
      .send()
  }

  static removePlanet = (userNormalPlanetId: string): Promise<any> => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [{ internalType: "uint64", name: "userNormalPlanetId", type: "uint64" }],
          name: "removePlanet",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
          signature: "0x10135315"
        }
      ],
      ChainEnv.loomContractAddresses.NormalPlanetController,
      { from: chains.loom.callerAddress() }
    ).methods
      .removePlanet(userNormalPlanetId)
      .send()
  }
}
