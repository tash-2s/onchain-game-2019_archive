import { chains } from "../../../misc/chains"

export class HighlightedUserController {
  static getUsers = (): Promise<{ accounts: Array<string>; golds: Array<string> }> => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: true,
          inputs: [],
          name: "getUsers",
          outputs: [
            { internalType: "address[]", name: "accounts", type: "address[]" },
            { internalType: "uint200[]", name: "golds", type: "uint200[]" }
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
          signature: "0x00ce8e3e"
        }
      ],
      chains.loom.env.contractAddresses.HighlightedUserController,
      { from: chains.loom.callerAddress() }
    ).methods
      .getUsers()
      .call()
  }
}
