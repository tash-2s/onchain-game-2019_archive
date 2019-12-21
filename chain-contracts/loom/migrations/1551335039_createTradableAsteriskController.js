const helper = require("../migrationHelper")

const TradableAsteriskController = artifacts.require("./controllers/TradableAsteriskController") // TODO: fix

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
    const userInGameAsteriskPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserInGameAsteriskPermanence"
    )
    const userTradableAsteriskPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserTradableAsteriskPermanence"
    )
    const tradableAsteriskIdToDataPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "TradableAsteriskIdToDataPermanence"
    )

    const highlightedUsersAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "HighlightedUserController"
    )

    const tradableAsteriskTokenLockerAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "TradableAsteriskTokenLocker"
    )

    const controller = await helper.deployAndRegister(
      deployer,
      network,
      TradableAsteriskController,
      [
        userInGameAsteriskPermanenceAddress,
        userTradableAsteriskPermanenceAddress,
        tradableAsteriskIdToDataPermanenceAddress,
        userGoldPermanenceAddress,
        highlightedUsersAddress,
        tradableAsteriskTokenLockerAddress
      ]
    )

    await new web3.eth.Contract(whitelistedABI, userGoldPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})

    await new web3.eth.Contract(whitelistedABI, userInGameAsteriskPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})

    await new web3.eth.Contract(whitelistedABI, userTradableAsteriskPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})
    await new web3.eth.Contract(whitelistedABI, tradableAsteriskIdToDataPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})

    await new web3.eth.Contract(whitelistedABI, tradableAsteriskTokenLockerAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})
  })
}
