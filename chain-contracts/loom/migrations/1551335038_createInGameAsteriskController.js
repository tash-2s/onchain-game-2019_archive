const helper = require("../migrationHelper")

const InGameAsteriskController = artifacts.require("./controllers/InGameAsteriskController") // TODO: fix

const whitelistedABI = [
  {
    constant: false,
    inputs: [
      {
        name: "account",
        type: "address"
      }
    ],
    name: "addWhitelisted",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
]

module.exports = function(deployer, network, accounts) {
  deployer.then(async function() {
    const userGoldPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserGoldPermanence"
    )
    const inGameAsteriskPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "InGameAsteriskPermanence"
    )
    const userInGameAsteriskPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserInGameAsteriskPermanence"
    )
    const userInGameAsteriskIdGeneratorPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserInGameAsteriskIdGeneratorPermanence"
    )
    const userTradableAsteriskPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserTradableAsteriskPermanence"
    )
    const tradableAsteriskIdToDataPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "TradableAsteriskIdToDataPermanence"
    )

    const controller = await helper.deployAndRegister(deployer, network, InGameAsteriskController, [
      userInGameAsteriskPermanenceAddress,
      userInGameAsteriskIdGeneratorPermanenceAddress,
      userTradableAsteriskPermanenceAddress,
      tradableAsteriskIdToDataPermanenceAddress,
      userGoldPermanenceAddress,
      inGameAsteriskPermanenceAddress
    ])

    await new web3.eth.Contract(whitelistedABI, userGoldPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})

    await new web3.eth.Contract(whitelistedABI, userInGameAsteriskPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})
    await new web3.eth.Contract(
      whitelistedABI,
      userInGameAsteriskIdGeneratorPermanenceAddress
    ).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})

    await new web3.eth.Contract(whitelistedABI, userTradableAsteriskPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})
    await new web3.eth.Contract(whitelistedABI, tradableAsteriskIdToDataPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})
  })
}
