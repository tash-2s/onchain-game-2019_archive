import { chains } from "../../../misc/chains"

export class SpecialPlanetToken {
  static approve = (to: string, tokenId: string | number, txOption?: {}) => {
    return new chains.loom.web3.eth.Contract(
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
      chains.loom.env.contractAddresses.SpecialPlanetToken,
      { from: chains.loom.callerAddress() }
    ).methods
      .approve(to, tokenId)
      .send(txOption)
  }

  static gateway = (): Promise<string> => {
    return new chains.loom.web3.eth.Contract(
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
      chains.loom.env.contractAddresses.SpecialPlanetToken,
      { from: chains.loom.callerAddress() }
    ).methods
      .gateway()
      .call()
  }

  static tokensOfOwnerByIndex = (
    owner: string,
    index: string | number
  ): Promise<{ tokenIds: Array<string>; nextIndex: string }> => {
    return new chains.loom.web3.eth.Contract(
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
      chains.loom.env.contractAddresses.SpecialPlanetToken,
      { from: chains.loom.callerAddress() }
    ).methods
      .tokensOfOwnerByIndex(owner, index)
      .call()
  }

  static setApprovalForAll = (to: string, approved: boolean, txOption?: {}) => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "bool", name: "approved", type: "bool" }
          ],
          name: "setApprovalForAll",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
          signature: "0xa22cb465"
        }
      ],
      chains.loom.env.contractAddresses.SpecialPlanetToken,
      { from: chains.loom.callerAddress() }
    ).methods
      .setApprovalForAll(to, approved)
      .send(txOption)
  }

  static isApprovedForAll = (owner: string, operator: string): Promise<boolean> => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: true,
          inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "operator", type: "address" }
          ],
          name: "isApprovedForAll",
          outputs: [{ internalType: "bool", name: "", type: "bool" }],
          payable: false,
          stateMutability: "view",
          type: "function",
          signature: "0xe985e9c5"
        }
      ],
      chains.loom.env.contractAddresses.SpecialPlanetToken,
      { from: chains.loom.callerAddress() }
    ).methods
      .isApprovedForAll(owner, operator)
      .call()
  }
}
