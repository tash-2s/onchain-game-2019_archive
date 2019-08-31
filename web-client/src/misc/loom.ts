import BN from "bn.js"
import {
  Client,
  Address,
  LocalAddress,
  CryptoUtils,
  LoomProvider,
  Contracts,
  EthersSigner,
  createDefaultTxMiddleware,
  NonceTxMiddleware,
  SignedEthTxMiddleware
} from "loom-js"
import { IWithdrawalReceipt } from "loom-js/dist/contracts/transfer-gateway"

import Web3 from "web3"
import { ethers } from "ethers"

import _ChainEnv from "../chain/env.json"
import UserABI from "../chain/abi/loom/UserController.json"
import NormalPlanetABI from "../chain/abi/loom/NormalPlanetController.json"
import RemarkableUserABI from "../chain/abi/loom/RemarkableUserController.json"
import SpecialPlanetTokenABI from "../chain/abi/loom/SpecialPlanetToken.json"

export const ChainEnv = _ChainEnv

export class Loom {
  address: string | null
  web3: Web3

  constructor() {
    this.address = null
    this.web3 = new Web3(Util.createLoomProviderWithDummyAddress())
  }

  loginWithEth = async (signer: ethers.Signer) => {
    const ethAddress = await signer.getAddress()

    const ethAddressInstance = new Address("eth", LocalAddress.fromHexString(ethAddress))
    const client = Util.createClient()
    const dummyAccount = Util.generateAccount()

    const addressMapper = await Contracts.AddressMapper.createAsync(
      client,
      new Address(client.chainId, LocalAddress.fromPublicKey(dummyAccount.publicKey))
    )
    if (!(await addressMapper.hasMappingAsync(ethAddressInstance))) {
      await addMappingWithNewLoomAccount(signer)
    }
    const mapping = await addressMapper.getMappingAsync(ethAddressInstance)

    const loomProvider = new LoomProvider(client, dummyAccount.privateKey)
    loomProvider.callerChainId = "eth"
    loomProvider.setMiddlewaresForAddress(ethAddressInstance.local.toString(), [
      new NonceTxMiddleware(ethAddressInstance, client),
      new SignedEthTxMiddleware(signer)
    ])

    const oldProvider = this.web3.currentProvider as LoomProvider
    oldProvider.disconnect()

    this.address = mapping.to.local.toChecksumString()
    this.web3 = new Web3(loomProvider)

    return { ethAddress, loomAddress: this.address }
  }

  getLoomTime = async () => {
    const o = await this.web3.eth.getBlock("latest")
    return o.timestamp
  }

  userController = () => {
    return new this.web3.eth.Contract(UserABI, ChainEnv.loomContractAddresses.UserController, {
      from: this._callerAddress()
    })
  }

  normalPlanetController = () => {
    return new this.web3.eth.Contract(
      NormalPlanetABI,
      ChainEnv.loomContractAddresses.NormalPlanetController,
      { from: this._callerAddress() }
    )
  }

  remarkableUserController = () => {
    return new this.web3.eth.Contract(
      RemarkableUserABI,
      ChainEnv.loomContractAddresses.RemarkableUserController,
      { from: this._callerAddress() }
    )
  }

  specialPlanetToken = () => {
    return new this.web3.eth.Contract(
      SpecialPlanetTokenABI,
      ChainEnv.loomContractAddresses.SpecialPlanetToken,
      { from: this._callerAddress() }
    )
  }

  // return eth address if logined, otherwise return loom dummy address
  private _callerAddress = () => {
    const provider = this.web3.currentProvider as LoomProvider
    const addresses = Array.from(provider.accounts.keys())
    return addresses[addresses.length - 1]
  }
}

class Util {
  static createClient = () => {
    const p = [ChainEnv.loom.chainId, ChainEnv.loom.writeUrl, ChainEnv.loom.readUrl] as const
    return new Client(...p)
  }

  static generateAccount = () => {
    const privateKey = CryptoUtils.generatePrivateKey()
    const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
    const address = LocalAddress.fromPublicKey(publicKey).toChecksumString()
    return { privateKey, publicKey, address }
  }

  static createLoomProviderWithDummyAddress = () => {
    const { privateKey } = Util.generateAccount()
    return new LoomProvider(Util.createClient(), privateKey)
  }
}

const addMappingWithNewLoomAccount = async (signer: ethers.Signer) => {
  const ethAddressInstance = new Address(
    "eth",
    LocalAddress.fromHexString(await signer.getAddress())
  )
  const newLoomAccount = Util.generateAccount()
  const client = Util.createClient()
  client.txMiddleware = createDefaultTxMiddleware(client, newLoomAccount.privateKey)
  const newLoomAddressInstance = new Address(
    client.chainId,
    LocalAddress.fromPublicKey(newLoomAccount.publicKey)
  )
  const addressMapper = await Contracts.AddressMapper.createAsync(client, newLoomAddressInstance)

  // This is needed before calling addIdentityMappingAsync.
  // Otherwise it throws an error.
  // Weired implementation...
  await addressMapper.hasMappingAsync(ethAddressInstance)

  await addressMapper.addIdentityMappingAsync(
    newLoomAddressInstance,
    ethAddressInstance,
    new EthersSigner(signer)
  )
  client.disconnect()
}

export const withdrawPreparation = async (
  chain: any,
  ethSigner: ethers.Signer,
  ethSpecialPlanetTokenContractAddress: string,
  tokenId?: string
) => {
  const receipt = await withGateway(ethSigner, async gateway => {
    if (tokenId) {
      await transferTokenToLoomGateway(chain, ethSigner, tokenId, gateway)
      await sleep(10)
    }

    let receipt: IWithdrawalReceipt | null = null
    for (let i = 0; i < 20; i++) {
      // console.log(`signature check polling count: ${i + 1}`)
      receipt = await getWithdrawalReceipt(
        chain,
        ethSigner,
        ethSpecialPlanetTokenContractAddress,
        gateway
      )
      if (receipt && receipt.oracleSignature.length > 0) {
        break
      }
      await sleep(5)
    }
    return receipt
  })

  if (!(receipt && receipt.oracleSignature.length > 0)) {
    throw new Error("no withdrawal receipt")
  }

  const signature = CryptoUtils.bytesToHexAddr(receipt.oracleSignature)

  const _tokenId = receipt.tokenId ? receipt.tokenId.toString() : null
  if (!_tokenId || (tokenId && tokenId !== _tokenId)) {
    throw new Error("wrong token")
  }

  return { tokenId: _tokenId, signature }
}

export const withGateway = async <T>(
  ethSigner: ethers.Signer,
  fn: (gateway: Contracts.TransferGateway) => Promise<T>
) => {
  const { gateway, client } = await getGateway(ethSigner)
  const result = await fn(gateway)
  client.disconnect()
  return result
}

const getGateway = async (ethSigner: ethers.Signer) => {
  const ethAddress = await ethSigner.getAddress()
  const ethAddressInstance = Address.fromString(`eth:${ethAddress}`)
  const client = Util.createClient()
  client.txMiddleware = [
    new NonceTxMiddleware(ethAddressInstance, client),
    new SignedEthTxMiddleware(ethSigner)
  ]

  return {
    gateway: await Contracts.TransferGateway.createAsync(client, ethAddressInstance),
    client: client
  }
}

const transferTokenToLoomGateway = async (
  chain: any,
  ethSigner: ethers.Signer,
  tokenId: string,
  gateway: Contracts.TransferGateway
) => {
  const gatewayAddress = await chain.loom
    .specialPlanetToken()
    .methods.gateway()
    .call()
  await chain.loom
    .specialPlanetToken()
    .methods.approve(gatewayAddress, tokenId)
    .send()
  const ethAddress = await ethSigner.getAddress()

  await gateway.withdrawERC721Async(
    new BN(tokenId),
    Address.fromString(
      `${ChainEnv.loom.chainId}:${chain.loom.specialPlanetToken().options.address}`
    ),
    Address.fromString(`eth:${ethAddress}`)
  )
}

export const getWithdrawalReceipt = async (
  chain: any,
  ethSigner: ethers.Signer,
  ethSpecialPlanetTokenContractAddress: string,
  gateway: Contracts.TransferGateway
) => {
  const receipt = await gateway.withdrawalReceiptAsync(
    Address.fromString(`${ChainEnv.loom.chainId}:${chain.loom.address}`)
  )
  const ethAddress = await ethSigner.getAddress()
  if (
    receipt &&
    receipt.tokenContract.local.toString().toLowerCase() ===
      ethSpecialPlanetTokenContractAddress.toLowerCase() &&
    receipt.tokenOwner.local.toString().toLowerCase() === ethAddress.toLowerCase()
  ) {
    return receipt
  }
  return null
}

const sleep = (sec: number) => {
  return new Promise(resolve => {
    setTimeout(resolve, sec * 1000)
  })
}
