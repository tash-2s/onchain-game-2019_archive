const helper = require("../migrationHelper")

const NormalPlanetController = artifacts.require("./controllers/NormalPlanetController") // TODO: fix

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
    const normalPlanetPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "NormalPlanetPermanence"
    )
    const userNormalPlanetPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanetPermanence"
    )
    const userNormalPlanetIdGeneratorPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanetIdGeneratorPermanence"
    )
    const userSpecialPlanetPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserSpecialPlanetPermanence"
    )
    const specialPlanetIdToDataPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "SpecialPlanetIdToDataPermanence"
    )

    const controller = await helper.deployAndRegister(deployer, network, NormalPlanetController, [
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdGeneratorPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      specialPlanetIdToDataPermanenceAddress,
      userGoldPermanenceAddress,
      normalPlanetPermanenceAddress
    ])

    await new web3.eth.Contract(whitelistedABI, userGoldPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})

    await new web3.eth.Contract(whitelistedABI, userNormalPlanetPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})
    await new web3.eth.Contract(
      whitelistedABI,
      userNormalPlanetIdGeneratorPermanenceAddress
    ).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})

    await new web3.eth.Contract(whitelistedABI, userSpecialPlanetPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})
    await new web3.eth.Contract(whitelistedABI, specialPlanetIdToDataPermanenceAddress).methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})
  })
}
