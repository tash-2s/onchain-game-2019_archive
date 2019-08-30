// https://github.com/loomnetwork/truffle-dappchain-example/blob/master/gateway-cli.js
// https://loomx.io/developers/en/extdev-transfer-gateway.html

const fs = require("fs")
const path = require("path")

const Web3 = require("web3")
const {
  Client,
  NonceTxMiddleware,
  SignedTxMiddleware,
  Address,
  LocalAddress,
  CryptoUtils,
  LoomProvider,
  Contracts,
  soliditySha3,
  OfflineWeb3Signer
} = require("loom-js")
const BN = require("bn.js")

const EthTokenJSON = require("./eth/build/contracts/SpecialPlanetToken.json")
const LoomTokenJSON = require("./loom/build/contracts/SpecialPlanetToken.json")

function loadRinkebyAccount() {
  const MnemonicUtil = require("./eth/MnemonicUtil.js")
  const InfuraUtil = require("./eth/InfuraUtil.js")

  const {privateKey} = new MnemonicUtil("rinkeby").getAddressAndPrivateKey()
  const infuraEndpoint = new InfuraUtil().getApiEndpoint()

  const web3js = new Web3(infuraEndpoint)
  const ownerAccount = web3js.eth.accounts.privateKeyToAccount("0x" + privateKey)
  web3js.eth.accounts.wallet.add(ownerAccount)

  return {account: ownerAccount, web3js}
}

function loadExtdevAccount() {
  const privateKeyStr = fs.readFileSync(
    path.join(__dirname, "./loom/extdev_private_key"),
    "utf-8"
  )
  const privateKey = CryptoUtils.B64ToUint8Array(privateKeyStr)
  const publicKey = CryptoUtils.publicKeyFromPrivateKey(privateKey)
  const client = new Client(
    "extdev-plasma-us1",
    "wss://extdev-plasma-us1.dappchains.com/websocket",
    "wss://extdev-plasma-us1.dappchains.com/queryws"
  )
  client.txMiddleware = [
    new NonceTxMiddleware(publicKey, client),
    new SignedTxMiddleware(privateKey)
  ]
  client.on("error", msg => {
    console.error("PlasmaChain connection error", msg)
  })

  return {
    account: LocalAddress.fromPublicKey(publicKey).toString(),
    web3js: new Web3(new LoomProvider(client, privateKey)),
    client
  }
}

const mapContracts = async () => {
  const rinkeby = loadRinkebyAccount()
  const extdev = loadExtdevAccount()

  const client = extdev.client

  const rinkebyNetworkId = await rinkeby.web3js.eth.net.getId()
  const extdevNetworkId = await extdev.web3js.eth.net.getId()

  const tokenRinkebyAddress = EthTokenJSON.networks[rinkebyNetworkId].address
  const rinkebyTxHash = EthTokenJSON.networks[rinkebyNetworkId].transactionHash
  const tokenExtdevAddress = LoomTokenJSON.networks[extdevNetworkId].address

  const ownerExtdevAddr = Address.fromString(`${client.chainId}:${extdev.account}`)
  const gatewayContract = await Contracts.TransferGateway.createAsync(client, ownerExtdevAddr)
  const foreignContract = Address.fromString(`eth:${tokenRinkebyAddress}`)
  const localContract = Address.fromString(`${client.chainId}:${tokenExtdevAddress}`)

  const hash = soliditySha3(
    {type: "address", value: tokenRinkebyAddress.slice(2)},
    {type: "address", value: tokenExtdevAddress.slice(2)}
  )
  const signer = new OfflineWeb3Signer(rinkeby.web3js, rinkeby.account)
  const foreignContractCreatorSig = await signer.signAsync(hash)

  const foreignContractCreatorTxHash = Buffer.from(rinkebyTxHash.slice(2), "hex")

  await gatewayContract.addContractMappingAsync({
    localContract,
    foreignContract,
    foreignContractCreatorSig,
    foreignContractCreatorTxHash
  })

  console.log(`Submitted request to map ${tokenExtdevAddress} to ${tokenRinkebyAddress}`)
  client.disconnect()
}

;(async () => {
  await mapContracts()
  console.log("finished!")
})()
