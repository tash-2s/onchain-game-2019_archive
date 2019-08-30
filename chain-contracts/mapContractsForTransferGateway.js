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
  LoomProvider,
  Contracts,
  soliditySha3,
  OfflineWeb3Signer
} = require("loom-js")
const BN = require("bn.js")

const EthTokenJSON = require("./eth/build/contracts/SpecialPlanetToken.json")
const LoomTokenJSON = require("./loom/build/contracts/SpecialPlanetToken.json")

const loadEth = envName => {
  const MnemonicUtil = require("./eth/MnemonicUtil.js")
  const InfuraUtil = require("./eth/InfuraUtil.js")

  const {privateKey} = new MnemonicUtil(envName).getAddressAndPrivateKey()
  const infuraEndpoint = new InfuraUtil().getApiEndpoint()

  const web3js = new Web3(infuraEndpoint)
  const account = web3js.eth.accounts.privateKeyToAccount("0x" + privateKey)
  web3js.eth.accounts.wallet.add(account)

  return {account: account, web3js}
}

const loadLoom = envName => {
  const PrivateKeyUtil = require("./loom/PrivateKeyUtil.js")
  const util = new PrivateKeyUtil(envName)
  const {publicKey, privateKey} = util.getPublicKeyAndPrivateKey()

  const env = JSON.parse(fs.readFileSync("./loom/envs.json"))[envName]
  if (!env) {
    throw new Error("please define env")
  }
  const client = new Client(env.chainId, env.writeUrl, env.readUrl)

  client.txMiddleware = [
    new NonceTxMiddleware(publicKey, client),
    new SignedTxMiddleware(privateKey)
  ]

  return {
    account: util.getAddress(),
    web3js: new Web3(new LoomProvider(client, privateKey)),
    client
  }
}

const mapContracts = async (ethEnvName, loomEnvName) => {
  const eth = loadEth(ethEnvName)
  const loom = loadLoom(loomEnvName)

  const ethNetworkId = await eth.web3js.eth.net.getId()
  const loomNetworkId = await loom.web3js.eth.net.getId()

  const tokenEthAddress = EthTokenJSON.networks[ethNetworkId].address
  const ethTxHash = EthTokenJSON.networks[ethNetworkId].transactionHash
  const tokenLoomAddress = LoomTokenJSON.networks[loomNetworkId].address

  const foreignContract = Address.fromString(`eth:${tokenEthAddress}`)
  const localContract = Address.fromString(`${loom.client.chainId}:${tokenLoomAddress}`)

  const hash = soliditySha3(
    {type: "address", value: tokenEthAddress.slice(2)},
    {type: "address", value: tokenLoomAddress.slice(2)}
  )
  const signer = new OfflineWeb3Signer(eth.web3js, eth.account)
  const foreignContractCreatorSig = await signer.signAsync(hash)

  const foreignContractCreatorTxHash = Buffer.from(ethTxHash.slice(2), "hex")

  const gateway = await Contracts.TransferGateway.createAsync(
    loom.client,
    Address.fromString(`${loom.client.chainId}:${loom.account}`)
  )
  await gateway.addContractMappingAsync({
    localContract,
    foreignContract,
    foreignContractCreatorSig,
    foreignContractCreatorTxHash
  })

  console.log(`Submitted request to map ${tokenLoomAddress} to ${tokenEthAddress}`)
  loom.client.disconnect()
}

;(async () => {
  await mapContracts("rinkeby", "extdev")
})()
