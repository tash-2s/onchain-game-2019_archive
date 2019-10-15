import { chains } from "../../../chain/chains"

export class UserController {
  static getUser = (
    account: string
  ): Promise<{
    confirmedGold: string
    goldConfirmedAt: string
    unpIds: Array<string>
    unpRanks: Array<string>
    unpTimes: Array<string>
    unpAxialCoordinates: Array<string>
  }> => {
    return new chains.loom.web3.eth.Contract(
      [
        {
          constant: true,
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "getUser",
          outputs: [
            { internalType: "uint200", name: "confirmedGold", type: "uint200" },
            { internalType: "uint32", name: "goldConfirmedAt", type: "uint32" },
            { internalType: "uint64[]", name: "unpIds", type: "uint64[]" },
            { internalType: "uint8[]", name: "unpRanks", type: "uint8[]" },
            { internalType: "uint32[]", name: "unpTimes", type: "uint32[]" },
            { internalType: "int16[]", name: "unpAxialCoordinates", type: "int16[]" }
          ],
          payable: false,
          stateMutability: "view",
          type: "function",
          signature: "0x6f77926b"
        }
      ],
      chains.loom.env.contractAddresses.UserController,
      { from: chains.loom.callerAddress() }
    ).methods
      .getUser(account)
      .call()
  }
}
