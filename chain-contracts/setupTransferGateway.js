// https://github.com/loomnetwork/truffle-dappchain-example/blob/master/gateway-cli.j://github.com/loomnetwork/truffle-dappchain-example/blob/master/gateway-cli.js
// https://loomx.io/developers/en/extdev-transfer-gateway.html

const fs = require("fs")
const path = require("path")

const Web3 = require('web3')
const {
  Client, NonceTxMiddleware, SignedTxMiddleware, Address, LocalAddress, CryptoUtils, LoomProvider,
  Contracts, Web3Signer, soliditySha3
} = require('loom-js')
const { OfflineWeb3Signer } = require('loom-js/dist/solidity-helpers') // TODO
const BN = require('bn.js')

const MnemonicUtil = require("./ethereum/MnemonicUtil.js")
const InfuraUtil = require("./ethereum/InfuraUtil.js")

const EthereumTokenJSON = require('./ethereum/build/contracts/SpecialPlanet.json')
const LoomchainTokenJSON = require('./loomchain/build/contracts/Erc721SpecialPlanet.json')

const RinkebyGatewayJSON = require('./Gateway.json')

function loadRinkebyAccount() {
  const { privateKey } = new MnemonicUtil("rinkeby").getAddressAndPrivateKey()
  const infuraEndpoint = new InfuraUtil().getApiEndpoint()

  const web3js = new Web3(infuraEndpoint)
  const ownerAccount = web3js.eth.accounts.privateKeyToAccount('0x' + privateKey)
  web3js.eth.accounts.wallet.add(ownerAccount)

  return { account: ownerAccount, web3js }
}

function loadExtdevAccount() {
  const privateKeyStr = fs.readFileSync(path.join(__dirname, './loomchain/extdev_private_key'), 'utf-8')
  const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr)
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
  const client = new Client(
    'extdev-plasma-us1',
    'wss://extdev-plasma-us1.dappchains.com/websocket',
    'wss://extdev-plasma-us1.dappchains.com/queryws'
  )
  client.txMiddleware = [
    new NonceTxMiddleware(publicKey, client),
    new SignedTxMiddleware(privateKey)
  ]
  client.on('error', msg => {
    console.error('PlasmaChain connection error', msg)
  })

  return {
    account: LocalAddress.fromPublicKey(publicKey).toString(),
    web3js: new Web3(new LoomProvider(client, privateKey)),
    client
  }
}

const mapContracts = async () => {
  let client
  try {
    const rinkeby = loadRinkebyAccount()
    const extdev = loadExtdevAccount()

    client = extdev.client

    const rinkebyNetworkId = await rinkeby.web3js.eth.net.getId()
    const extdevNetworkId = await extdev.web3js.eth.net.getId()

    const tokenRinkebyAddress = EthereumTokenJSON.networks[rinkebyNetworkId].address
    const rinkebyTxHash = EthereumTokenJSON.networks[rinkebyNetworkId].transactionHash
    const tokenExtdevAddress = LoomchainTokenJSON.networks[extdevNetworkId].address

    const ownerExtdevAddr = Address.fromString(`${client.chainId}:${extdev.account}`)
    const gatewayContract = await Contracts.TransferGateway.createAsync(client, ownerExtdevAddr)
    const foreignContract = Address.fromString(`eth:${tokenRinkebyAddress}`)
    const localContract = Address.fromString(`${client.chainId}:${tokenExtdevAddress}`)

    const hash = soliditySha3(
      { type: 'address', value: tokenRinkebyAddress.slice(2) },
      { type: 'address', value: tokenExtdevAddress.slice(2) }
    )
    const signer = new OfflineWeb3Signer(rinkeby.web3js, rinkeby.account)
    const foreignContractCreatorSig = await signer.signAsync(hash)

    const foreignContractCreatorTxHash = Buffer.from(rinkebyTxHash.slice(2), 'hex')

    await gatewayContract.addContractMappingAsync({
      localContract,
      foreignContract,
      foreignContractCreatorSig,
      foreignContractCreatorTxHash
    })

    console.log(`Submitted request to map ${tokenExtdevAddress} to ${tokenRinkebyAddress}`)
  } catch (err) {
    console.error(err)
  } finally {
    if (client) {
      client.disconnect()
    }
  }
}

// this will be implemented in web-client
const mapAccounts = async () => {
  let client
  try {
    const rinkeby = loadRinkebyAccount()
    const extdev = loadExtdevAccount()
    client = extdev.client

    const ownerRinkebyAddr = Address.fromString(`eth:${rinkeby.account.address}`)
    const ownerExtdevAddr = Address.fromString(`${client.chainId}:${extdev.account}`)
    const mapperContract = await Contracts.AddressMapper.createAsync(client, ownerExtdevAddr)

    try {
      const mapping = await mapperContract.getMappingAsync(ownerExtdevAddr)
      console.log(`${mapping.from.toString()} is already mapped to ${mapping.to.toString()}`)
      return
    } catch (err) {
      // assume this means there is no mapping yet, need to fix loom-js not to throw in this case
    }

    console.log(`mapping ${ownerRinkebyAddr.toString()} to ${ownerExtdevAddr.toString()}`)

    const signer = new OfflineWeb3Signer(rinkeby.web3js, rinkeby.account)
    await mapperContract.addIdentityMappingAsync(ownerExtdevAddr, ownerRinkebyAddr, signer)

    console.log(`Mapped ${ownerExtdevAddr} to ${ownerRinkebyAddr}`)
  } catch (err) {
    console.error(err)
  } finally {
    if (client) {
      client.disconnect()
    }
  }
}

const withdrawToken = async (tokenId) => {
  const options = {}
  let client
  try {
    const extdev = loadExtdevAccount()
    const rinkeby = loadRinkebyAccount()
    client = extdev.client

    const rinkebyNetworkId = await rinkeby.web3js.eth.net.getId()
    const extdevNetworkId = await extdev.web3js.eth.net.getId()

    let signature
    if (true) {
      signature = await depositTokenToExtdevGateway({
        client: extdev.client,
        web3js: extdev.web3js,
        tokenId: tokenId,
        ownerExtdevAddress: extdev.account,
        ownerRinkebyAddress: rinkeby.account.address,
        tokenExtdevAddress: LoomchainTokenJSON.networks[extdevNetworkId].address,
        tokenRinkebyAddress: EthereumTokenJSON.networks[rinkebyNetworkId].address,
        timeout: options.timeout ? (options.timeout * 1000) : 120000
      })
      console.log(`Token ${tokenId} deposited to DAppChain Gateway...`)
    } else {
      const ownerAddr = Address.fromString(`${extdev.client.chainId}:${extdev.account}`)
      const gatewayContract = await Contracts.TransferGateway.createAsync(extdev.client, ownerAddr)
      const receipt = await gatewayContract.withdrawalReceiptAsync(ownerAddr)
      signature = CryptoUtils.bytesToHexAddr(receipt.oracleSignature)
      console.log("resumed")
    }

    const tx = await withdrawTokenFromRinkebyGateway({
      web3js: rinkeby.web3js,
      tokenId: tokenId,
      accountAddress: rinkeby.account.address,
      signature,
      gas: options.gas || 350000
    })
    console.log(`Token ${tokenId} withdrawn from Ethereum Gateway.`)
    console.log(`Rinkeby tx hash: ${tx.transactionHash}`)
  } catch (err) {
    console.error(err)
  } finally {
    if (client) {
      client.disconnect()
    }
  }
}

// Returns a promise that will be resolved with a hex string containing the signature that must
// be submitted to the Ethereum Gateway to withdraw a token.
async function depositTokenToExtdevGateway({
  client, web3js, tokenId,
  ownerExtdevAddress, ownerRinkebyAddress,
  tokenExtdevAddress, tokenRinkebyAddress, timeout
}) {
  const ownerExtdevAddr = Address.fromString(`${client.chainId}:${ownerExtdevAddress}`)
  const gatewayContract = await Contracts.TransferGateway.createAsync(client, ownerExtdevAddr)

  const tokenContract = await getExtdevTokenContract(web3js)
  const extdevGatewayAddress = (await client.getContractAddressAsync("gateway")).local.toString()
  await tokenContract.methods
    .approve(extdevGatewayAddress, tokenId)
    .send({ from: ownerExtdevAddress })

  const ownerRinkebyAddr = Address.fromString(`eth:${ownerRinkebyAddress}`)
  const receiveSignedWithdrawalEvent = new Promise((resolve, reject) => {
    let timer = setTimeout(
      () => reject(new Error('Timeout while waiting for withdrawal to be signed')),
      timeout
    )
    const listener = event => {
      const tokenEthAddr = Address.fromString(`eth:${tokenRinkebyAddress}`)
      if (
        event.tokenContract.toString() === tokenEthAddr.toString() &&
        event.tokenOwner.toString() === ownerRinkebyAddr.toString()
      ) {
        clearTimeout(timer)
        timer = null
        gatewayContract.removeAllListeners(Contracts.TransferGateway.EVENT_TOKEN_WITHDRAWAL)
        resolve(event)
      }
    }
    gatewayContract.on(Contracts.TransferGateway.EVENT_TOKEN_WITHDRAWAL, listener)
  })

  const tokenExtdevAddr = Address.fromString(`${client.chainId}:${tokenExtdevAddress}`)
  await gatewayContract.withdrawERC721Async(new BN(tokenId), tokenExtdevAddr, ownerRinkebyAddr)

  const event = await receiveSignedWithdrawalEvent
  return CryptoUtils.bytesToHexAddr(event.sig)
}

async function getExtdevTokenContract(web3js) {
  const networkId = await web3js.eth.net.getId()
  return new web3js.eth.Contract(
    LoomchainTokenJSON.abi,
    LoomchainTokenJSON.networks[networkId].address,
  )
}

async function withdrawTokenFromRinkebyGateway({ web3js, tokenId, accountAddress, signature, gas }) {
  const gatewayContract = await getRinkebyGatewayContract(web3js)
  const networkId = await web3js.eth.net.getId()

  const gasEstimate = await gatewayContract.methods
    .withdrawERC721(tokenId, signature, EthereumTokenJSON.networks[networkId].address)
    .estimateGas({ from: accountAddress, gas })

  if (gasEstimate == gas) {
    throw new Error('Not enough enough gas, send more.')
  }

  return gatewayContract.methods
    .withdrawERC721(tokenId, signature, EthereumTokenJSON.networks[networkId].address)
    .send({ from: accountAddress, gas: gasEstimate })
}

async function getRinkebyGatewayContract(web3js) {
  const networkId = await web3js.eth.net.getId()
  return new web3js.eth.Contract(
    RinkebyGatewayJSON.abi,
    RinkebyGatewayJSON.networks[networkId].address
  )
}

(async () => {
  // await withdrawToken(1)
  console.log("finished!")
})()
