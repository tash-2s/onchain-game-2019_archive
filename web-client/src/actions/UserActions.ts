import {
  LocalAddress,
  Address,
  CryptoUtils,
  Contracts,
  NonceTxMiddleware,
  SignedEthTxMiddleware,
  getMetamaskSigner
} from "loom-js"
import BN from "bn.js"

import { AbstractActions } from "./AbstractActions"
import { AppActions } from "./AppActions"
import {
  callLoomContractMethod,
  sendLoomContractMethod,
  LoomWeb3,
  ChainEnv,
  LoomUtil
} from "../misc/loom"
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
  transferTokenToEth = async (tokenId?: string) => {
    new AppActions(this.dispatch).startLoading()
    const txHash = await withdraw(tokenId)

    this.dispatch(UserActions.transferTokenToEth(txHash))
    new AppActions(this.dispatch).stopLoading()
  }
}

const withdraw = async (tokenId?: string) => {
  const { gateway, client: gatewayClient } = await getGateway()

  if (tokenId) {
    await transferTokenToLoomGateway(tokenId, gateway)
    await sleep(10)
  }

  let receipt: any
  for (let i = 0; i < 15; i++) {
    console.log(`signature check polling count: ${i + 1}`)
    receipt = await gateway.withdrawalReceiptAsync(
      Address.fromString(`${ChainEnv.loom.chainId}:${LoomWeb3.address}`)
    )
    if (receipt && receipt.oracleSignature.length > 0) {
      break
    }
    await sleep(5)
  }
  gatewayClient.disconnect()

  if (!receipt) {
    throw new Error("no withdrawal receipt")
  }

  const signature = CryptoUtils.bytesToHexAddr(receipt.oracleSignature)

  const _tokenId = receipt.tokenId.toString()
  if (tokenId && tokenId !== _tokenId) {
    throw new Error("wrong token")
  }

  const tx = await withdrawTokenFromEthGateway(_tokenId, signature)

  return tx.transactionHash
}

const getGateway = async () => {
  const ethAddressInstance = Address.fromString(`eth:${EthWeb3.address}`)
  const client = LoomUtil.createClient()
  client.txMiddleware = [
    new NonceTxMiddleware(ethAddressInstance, client),
    new SignedEthTxMiddleware(EthWeb3.signer)
  ]

  return {
    gateway: await Contracts.TransferGateway.createAsync(client, ethAddressInstance),
    client
  }
}

const transferTokenToLoomGateway = async (tokenId: string, gateway: Contracts.TransferGateway) => {
  const gatewayAddress = await callLoomContractMethod(cs => cs.SpecialPlanetToken.methods.gateway())
  await sendLoomContractMethod(cs => cs.SpecialPlanetToken.methods.approve(gatewayAddress, tokenId))

  await gateway.withdrawERC721Async(
    new BN(tokenId),
    Address.fromString(`${ChainEnv.loom.chainId}:${LoomWeb3.specialPlanetToken().options.address}`),
    Address.fromString(`eth:${EthWeb3.address}`)
  )
}

const withdrawTokenFromEthGateway = async (tokenId: string, signature: string) => {
  const gatewayContract = await EthWeb3.gateway()
  const tokenAddress = EthWeb3.specialPlanetToken().options.address

  return gatewayContract.methods
    .withdrawERC721(tokenId, signature, tokenAddress)
    .send({ from: EthWeb3.address })
}

const sleep = (sec: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, sec * 1000)
  })
}
