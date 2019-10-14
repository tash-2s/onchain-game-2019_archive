import { chains } from "../../../misc/chains"

export class Gateway {
  static withdrawERC721 = (
    gatewayAddress: string,
    tokenId: string,
    signature: string,
    tokenAddress: string
  ) => {
    if (!chains.eth.web3 || !chains.eth.address) {
      throw new Error("not logined")
    }

    return new chains.eth.web3.eth.Contract(
      [
        {
          constant: false,
          inputs: [
            {
              name: "uid",
              type: "uint256"
            },
            {
              name: "sig",
              type: "bytes"
            },
            {
              name: "contractAddress",
              type: "address"
            }
          ],
          name: "withdrawERC721",
          outputs: [],
          payable: false,
          stateMutability: "nonpayable",
          type: "function",
          signature: "0xc899a86b"
        }
      ],
      gatewayAddress,
      { from: chains.eth.address }
    ).methods
      .withdrawERC721(tokenId, signature, tokenAddress)
      .send()
  }
}
