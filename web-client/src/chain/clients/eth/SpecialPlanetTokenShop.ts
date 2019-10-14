import { chains } from "../../../misc/chains"
import ChainEnv from "../../../chain/env.json"

export class SpecialPlanetTokenShop {
  static price = (): Promise<{ 0: string }> => {
    if (!chains.eth.web3 || !chains.eth.address) {
      throw new Error("not logined")
    }
    return new chains.eth.web3.eth.Contract(
      [
        {
          constant: true,
          inputs: [],
          name: "price",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          payable: false,
          stateMutability: "view",
          type: "function",
          signature: "0xa035b1fe"
        }
      ],
      ChainEnv.ethContractAddresses.SpecialPlanetTokenShop,
      { from: chains.eth.address }
    ).methods
      .price()
      .call()
  }

  static sell = (txOption?: {}) => {
    if (!chains.eth.web3 || !chains.eth.address) {
      throw new Error("not logined")
    }
    return new chains.eth.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [],
          name: "sell",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          payable: true,
          stateMutability: "payable",
          type: "function",
          signature: "0x45710074"
        }
      ],
      ChainEnv.ethContractAddresses.SpecialPlanetTokenShop,
      { from: chains.eth.address }
    ).methods
      .sell()
      .send(txOption)
  }
}
