import { chains } from "../../../misc/chains"

export class NormalPlanetController {
  static setPlanet = (
    planetId: string,
    axialCoordinateQ: string,
    axialCoordinateR: string,
    txOption?: {}
  ) => {
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
      chains.loom.env.contractAddresses.NormalPlanetController,
      { from: chains.loom.callerAddress() }
    ).methods
      .setPlanet(planetId, axialCoordinateQ, axialCoordinateR)
      .send(txOption)
  }

  static rankupPlanet = (userNormalPlanetId: string, targetRank: string, txOption?: {}) => {
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
      chains.loom.env.contractAddresses.NormalPlanetController,
      { from: chains.loom.callerAddress() }
    ).methods
      .rankupPlanet(userNormalPlanetId, targetRank)
      .send(txOption)
  }

  static removePlanet = (userNormalPlanetId: string, txOption?: {}) => {
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
      chains.loom.env.contractAddresses.NormalPlanetController,
      { from: chains.loom.callerAddress() }
    ).methods
      .removePlanet(userNormalPlanetId)
      .send(txOption)
  }
}
