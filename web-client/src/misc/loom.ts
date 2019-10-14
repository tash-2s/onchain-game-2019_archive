import BN from "bn.js"
import Web3 from "web3"
import { ethers } from "ethers"
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

import ChainEnv from "../chain/env.json"

type Env = (typeof ChainEnv)["loom"]

export class Loom {
  web3: Web3
  address: string | null
  env: Env

  constructor() {
    this.web3 = new Web3(LoomUtil.createProviderWithDummyAddress())
    this.address = null
    this.env = ChainEnv.loom
  }

  login = async (signer: ethers.Signer) => {
    const ethAddress = await signer.getAddress()

    const ethAddressInstance = new Address("eth", LocalAddress.fromHexString(ethAddress))
    const client = LoomUtil.createClient()
    const dummyAccount = LoomUtil.generateAccount()

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

    this.web3 = new Web3(loomProvider)
    this.address = mapping.to.local.toChecksumString()

    return { ethAddress, loomAddress: this.address }
  }

  getLoomTime = async () => {
    const o = await this.web3.eth.getBlock("latest")
    return o.timestamp
  }

  withGateway = async <T>(
    ethSigner: ethers.Signer,
    fn: (gateway: Contracts.TransferGateway) => Promise<T>
  ) => {
    const { gateway, client } = await getGateway(ethSigner)
    const result = await fn(gateway)
    client.disconnect()
    return result
  }

  getSpecialPlanetTokenWithdrawalReceipt = async (
    ethAddress: string,
    ethSpecialPlanetTokenAddress: string,
    gateway: Contracts.TransferGateway
  ) => {
    const receipt = await gateway.withdrawalReceiptAsync(
      Address.fromString(`${this.env.chainId}:${this.address}`)
    )
    if (
      receipt &&
      receipt.tokenContract.local.toString().toLowerCase() ===
        ethSpecialPlanetTokenAddress.toLowerCase() &&
      receipt.tokenOwner.local.toString().toLowerCase() === ethAddress.toLowerCase()
    ) {
      return receipt
    }
    return null
  }

  prepareSpecialPlanetTokenWithdrawal = async (
    ethSigner: ethers.Signer,
    ethSpecialPlanetTokenAddress: string,
    tokenId?: string
  ) => {
    const ethAddress = await ethSigner.getAddress()

    const receipt = await this.withGateway(ethSigner, async gateway => {
      if (tokenId) {
        await gateway.withdrawERC721Async(
          new BN(tokenId),
          Address.fromString(
            `${ChainEnv.loom.chainId}:${ChainEnv.loomContractAddresses.SpecialPlanetToken}`
          ),
          Address.fromString(`eth:${ethAddress}`)
        )
        await sleep(10)
      }

      let receipt: IWithdrawalReceipt | null = null
      for (let i = 0; i < 20; i++) {
        // console.log(`signature check polling count: ${i + 1}`)
        receipt = await this.getSpecialPlanetTokenWithdrawalReceipt(
          ethAddress,
          ethSpecialPlanetTokenAddress,
          gateway
        )
        // check it's signed
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

    const _tokenId = receipt.tokenId ? receipt.tokenId.toString() : null
    if (!_tokenId || (tokenId && tokenId !== _tokenId)) {
      throw new Error("wrong token")
    }

    return { tokenId: _tokenId, signature: CryptoUtils.bytesToHexAddr(receipt.oracleSignature) }
  }

  // return eth address if logined, otherwise return loom dummy address
  callerAddress = () => {
    const provider = this.web3.currentProvider as LoomProvider
    const addresses = Array.from(provider.accounts.keys())
    return addresses[addresses.length - 1]
  }
}

class LoomUtil {
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

  static createProviderWithDummyAddress = () => {
    const { privateKey } = LoomUtil.generateAccount()
    return new LoomProvider(LoomUtil.createClient(), privateKey)
  }
}

const addMappingWithNewLoomAccount = async (signer: ethers.Signer) => {
  const ethAddressInstance = new Address(
    "eth",
    LocalAddress.fromHexString(await signer.getAddress())
  )
  const newLoomAccount = LoomUtil.generateAccount()
  const client = LoomUtil.createClient()
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

const getGateway = async (ethSigner: ethers.Signer) => {
  const ethAddress = await ethSigner.getAddress()
  const ethAddressInstance = Address.fromString(`eth:${ethAddress}`)
  const client = LoomUtil.createClient()
  client.txMiddleware = [
    new NonceTxMiddleware(ethAddressInstance, client),
    new SignedEthTxMiddleware(ethSigner)
  ]

  return {
    gateway: await Contracts.TransferGateway.createAsync(client, ethAddressInstance),
    client: client
  }
}

const sleep = (sec: number) =>
  new Promise(resolve => {
    setTimeout(resolve, sec * 1000)
  })
