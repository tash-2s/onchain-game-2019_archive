const helper = require("../migrationHelper")

const SpecialPlanetController = artifacts.require("./controllers/SpecialPlanetController") // TODO: fix

const minterAdditionAbi = [
  {
    constant: false,
    inputs: [
      {
        name: "account",
        type: "address"
      }
    ],
    name: "addMinter",
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
    const userNormalPlanetPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanetPermanence"
    )
    const userSpecialPlanetPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserSpecialPlanetPermanence"
    )
    const specialPlanetIdToDataPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "SpecialPlanetIdToDataPermanence"
    )

    const highlightedUsersAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "HighlightedUserController"
    )

    const specialPlanetTokenLockerAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "SpecialPlanetTokenLocker"
    )

    const controller = await helper.deployAndRegister(deployer, network, SpecialPlanetController, [
      userNormalPlanetPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      specialPlanetIdToDataPermanenceAddress,
      userGoldPermanenceAddress,
      highlightedUsersAddress,
      specialPlanetTokenLockerAddress
    ])

    await new web3.eth.Contract(minterAdditionAbi, userGoldPermanenceAddress).methods
      .addMinter(controller.address)
      .send({from: accounts[0]})

    await new web3.eth.Contract(minterAdditionAbi, userNormalPlanetPermanenceAddress).methods
      .addMinter(controller.address)
      .send({from: accounts[0]})

    await new web3.eth.Contract(minterAdditionAbi, userSpecialPlanetPermanenceAddress).methods
      .addMinter(controller.address)
      .send({from: accounts[0]})
    await new web3.eth.Contract(minterAdditionAbi, specialPlanetIdToDataPermanenceAddress).methods
      .addMinter(controller.address)
      .send({from: accounts[0]})

    await new web3.eth.Contract(minterAdditionAbi, specialPlanetTokenLockerAddress).methods
      .addMinter(controller.address)
      .send({from: accounts[0]})
  })
}
