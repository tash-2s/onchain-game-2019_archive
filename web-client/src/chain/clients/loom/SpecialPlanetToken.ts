import { chains } from "../../../misc/chains"
import ChainEnv from "../../../chain/env.json"

export class SpecialPlanetToken {
  static approve = (to: string, tokenId: string): Promise<any> => {
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
      ChainEnv.loomContractAddresses.SpecialPlanetToken,
      { from: chains.loom.callerAddress() }
    ).methods
      .approve(to, tokenId)
      .send()
  }

  static setApprovalForAll = (to: string, approved: string): Promise<any> => {
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
      ChainEnv.loomContractAddresses.SpecialPlanetToken,
      { from: chains.loom.callerAddress() }
    ).methods
      .setApprovalForAll(to, approved)
      .send()
  }
}
