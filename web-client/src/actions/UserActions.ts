import { Address, CryptoUtils, Contracts } from "loom-js"
import BN from "bn.js"
import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"
import { callLoomContractMethod, sendLoomContractMethod, LoomWeb3 } from "../misc/loom"
import { EthWeb3 } from "../misc/eth"

export type GetUserResponse = any // TODO

interface User {
  address: string
  response: GetUserResponse
}

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<User>("setTargetUser")
  setTargetUser = async (address: string) => {
    const response = await callLoomContractMethod(cs => cs.UserController.methods.getUser(address))
    this.dispatch(UserActions.setTargetUser({ address, response }))
  }

  static setTargetUserSpecialPlanetTokens = UserActions.creator<{
    eth: Array<string>
    loom: Array<string>
  }>("setTargetUserSpecialPlanetTokens")
  setTargetUserSpecialPlanetTokens = async (address: string) => {
    if (address !== LoomWeb3.address) {
      throw new Error("this function is for my page")
    }

    const ethAddress = EthWeb3.address
    const ethTokenIds: Array<string> = []
    const ethBalance = await EthWeb3.callSpecialPlanetTokenMethod("balanceOf", ethAddress)
    for (let i = 0; i < ethBalance; i++) {
      ethTokenIds.push(
        await EthWeb3.callSpecialPlanetTokenMethod("tokenOfOwnerByIndex", ethAddress, i)
      )
    }

    const loomTokenIds: Array<string> = []
    const loomBalance = await callLoomContractMethod(cs =>
      cs.SpecialPlanetToken.methods.balanceOf(LoomWeb3.address)
    )
    for (let i = 0; i < loomBalance; i++) {
      loomTokenIds.push(
        await callLoomContractMethod(cs =>
          cs.SpecialPlanetToken.methods.tokenOfOwnerByIndex(LoomWeb3.address, i)
        )
      )
    }

    this.dispatch(
      UserActions.setTargetUserSpecialPlanetTokens({ eth: ethTokenIds, loom: loomTokenIds })
    )
  }

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }

  static getPlanet = UserActions.creator<User>("getPlanet")
  getPlanet = (planetId: number, axialCoordinateQ: number, axialCoordinateR: number) => {
    this.withLoading(async () => {
      await sendLoomContractMethod(cs =>
        cs.NormalPlanetController.methods.setPlanet(planetId, axialCoordinateQ, axialCoordinateR)
      )

      const address = LoomWeb3.address
      const response = await callLoomContractMethod(cs =>
        cs.UserController.methods.getUser(address)
      )

      this.dispatch(
        UserActions.getPlanet({
          address,
          response
        })
      )
    })
  }

  static rankupUserPlanet = UserActions.creator<User>("rankupUserPlanet")
  rankupUserPlanet = (userPlanetId: string, targetRank: number) => {
    this.withLoading(async () => {
      const address = LoomWeb3.address
      await sendLoomContractMethod(cs =>
        cs.NormalPlanetController.methods.rankupPlanet(userPlanetId, targetRank)
      )
      const response = await callLoomContractMethod(cs =>
        cs.UserController.methods.getUser(address)
      )
      this.dispatch(UserActions.rankupUserPlanet({ address, response }))
    })
  }

  static removeUserPlanet = UserActions.creator<User>("removeUserPlanet")
  removeUserPlanet = (userPlanetId: string) => {
    this.withLoading(async () => {
      const address = LoomWeb3.address
      await sendLoomContractMethod(cs =>
        cs.NormalPlanetController.methods.removePlanet(userPlanetId)
      )
      const response = await callLoomContractMethod(cs =>
        cs.UserController.methods.getUser(address)
      )
      this.dispatch(UserActions.removeUserPlanet({ address, response }))
    })
  }

  static buySpecialPlanetToken = UserActions.creator<string>("buySpecialPlanetToken")
  buySpecialPlanetToken = async () => {
    new AppActions(this.dispatch).startLoading()

    const price = await EthWeb3.callSpecialPlanetTokenShopMethod("price")
    EthWeb3.sendSpecialPlanetTokenShopMethod("sell", price).on("transactionHash", hash => {
      this.dispatch(UserActions.buySpecialPlanetToken(hash))

      new AppActions(this.dispatch).stopLoading()
    })
  }

  static transferTokenToLoom = UserActions.creator<string>("transferTokenToLoom")
  transferTokenToLoom = (tokenId: string) => {
    new AppActions(this.dispatch).startLoading()

    EthWeb3.sendSpecialPlanetTokenMethod("depositToGateway", tokenId).on(
      "transactionHash",
      hash => {
        this.dispatch(UserActions.transferTokenToLoom(hash))

        new AppActions(this.dispatch).stopLoading()
      }
    )
  }

  static transferTokenToEth = UserActions.creator<string>("transferTokenToEth")
  transferTokenToEth = async (tokenId: string) => {
    new AppActions(this.dispatch).startLoading()
    const txHash = await withdraw(tokenId)

    this.dispatch(UserActions.transferTokenToEth(txHash))
    new AppActions(this.dispatch).stopLoading()
  }
}

const withdraw = async (tokenId: string) => {
  let signature: string
  if (true) {
    signature = await depositTokenToLoomGateway(tokenId)
  } else {
    const loomUserAddress = Address.fromString(`${LoomWeb3.client.chainId}:${LoomWeb3.address}`)
    const gatewayContract = await Contracts.TransferGateway.createAsync(
      LoomWeb3.client,
      loomUserAddress
    )
    // maybe i should use this aside from event listening
    const receipt = await gatewayContract.withdrawalReceiptAsync(loomUserAddress)
    if (receipt === null) {
      throw new Error("no withdrawal receipt")
    }
    signature = CryptoUtils.bytesToHexAddr((receipt as any).oracleSignature)
  }
  const tx = await withdrawTokenFromEthGateway(tokenId, signature)

  return tx.transactionHash
}

// Returns a promise that will be resolved with a hex string containing the signature that must
// be submitted to the Ethereum Gateway to withdraw a token.
async function depositTokenToLoomGateway(tokenId: string) {
  const gatewayContract = await Contracts.TransferGateway.createAsync(
    LoomWeb3.client,
    Address.fromString(`${LoomWeb3.client.chainId}:${LoomWeb3.address}`)
  )

  const tokenContract = LoomWeb3.specialPlanetToken()
  const gatewayAddress = (await tokenContract.methods
    .gateway()
    .call({ from: LoomWeb3.address })).toLowerCase() // TODO: I think checksum address is ok
  await tokenContract.methods.approve(gatewayAddress, tokenId).send({ from: LoomWeb3.address })

  const receiveSignedWithdrawalEvent = new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Timeout while waiting for withdrawal to be signed")),
      120000
    )
    gatewayContract.on(Contracts.TransferGateway.EVENT_TOKEN_WITHDRAWAL, event => {
      if (
        event.tokenContract.toString() === EthWeb3.specialPlanetToken().options.address &&
        event.tokenOwner.toString() === EthWeb3.address
      ) {
        clearTimeout(timer)
        gatewayContract.removeAllListeners(Contracts.TransferGateway.EVENT_TOKEN_WITHDRAWAL)
        resolve(event)
      }
    })
  })

  await gatewayContract.withdrawERC721Async(
    new BN(tokenId),
    Address.fromString(`${LoomWeb3.client.chainId}:${tokenContract.options.address}`),
    Address.fromString(`eth:${EthWeb3.address}`)
  )
  const event = (await receiveSignedWithdrawalEvent) as any

  return CryptoUtils.bytesToHexAddr(event.sig)
}

async function withdrawTokenFromEthGateway(tokenId: string, signature: string) {
  const gatewayContract = await getEthGatewayContract()
  const tokenAddress = EthWeb3.specialPlanetToken().options.address

  return gatewayContract.methods
    .withdrawERC721(tokenId, signature, tokenAddress)
    .send({ from: EthWeb3.address })
}

async function getEthGatewayContract() {
  const address = await EthWeb3.callSpecialPlanetTokenMethod("gateway")
  console.log(address)
  const abi = [
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
  ]

  return new EthWeb3.web3.eth.Contract(abi, address)
}
