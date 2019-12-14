// generated by scripts/generateChainData.js
export class HighlightedUserController {
  constructor(private chain: import("../../loom").Loom) {}

  getUsers = (): Promise<{ accounts: Array<string>; golds: Array<string> }> => {
    return new this.chain.web3.eth.Contract(
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
          type: "function"
        }
      ],
      this.chain.env.contractAddresses.HighlightedUserController,
      { from: this.chain.callerAddress() }
    ).methods
      .getUsers()
      .call()
  }
}
