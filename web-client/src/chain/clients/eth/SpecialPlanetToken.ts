import { chains } from "../../../misc/chains"
import ChainEnv from "../../../chain/env.json"

export class SpecialPlanetToken {
  static approve = (to: string, tokenId: string, txOption?: {}) => {
    if (!chains.eth.web3 || !chains.eth.address) {
      throw new Error("not logined")
    }
    return new chains.eth.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" }
          ],
          name: "approve",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
          signature: "0x095ea7b3"
        }
      ],
      ChainEnv.ethContractAddresses.SpecialPlanetToken,
      { from: chains.eth.address }
    ).methods
      .approve(to, tokenId)
      .send(txOption)
  }

  static gateway = (): Promise<string> => {
    if (!chains.eth.web3 || !chains.eth.address) {
      throw new Error("not logined")
    }
    return new chains.eth.web3.eth.Contract(
      [
        {
          constant: true,
          inputs: [],
          name: "gateway",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          payable: false,
          stateMutability: "view",
          type: "function",
          signature: "0x116191b6"
        }
      ],
      ChainEnv.ethContractAddresses.SpecialPlanetToken,
      { from: chains.eth.address }
    ).methods
      .gateway()
      .call()
  }

  static tokensOfOwnerByIndex = (
    owner: string,
    index: string
  ): Promise<{ tokenIds: Array<string>; nextIndex: string }> => {
    if (!chains.eth.web3 || !chains.eth.address) {
      throw new Error("not logined")
    }
    return new chains.eth.web3.eth.Contract(
      [
        {
          constant: true,
          inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "uint256", name: "index", type: "uint256" }
          ],
          name: "tokensOfOwnerByIndex",
          outputs: [
            { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
            { internalType: "uint256", name: "nextIndex", type: "uint256" }
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
          signature: "0x4707f44f"
        }
      ],
      ChainEnv.ethContractAddresses.SpecialPlanetToken,
      { from: chains.eth.address }
    ).methods
      .tokensOfOwnerByIndex(owner, index)
      .call()
  }

  static depositToGateway = (id: string, txOption?: {}) => {
    if (!chains.eth.web3 || !chains.eth.address) {
      throw new Error("not logined")
    }
    return new chains.eth.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
          name: "depositToGateway",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
          signature: "0x9267daba"
        }
      ],
      ChainEnv.ethContractAddresses.SpecialPlanetToken,
      { from: chains.eth.address }
    ).methods
      .depositToGateway(id)
      .send(txOption)
  }
}
