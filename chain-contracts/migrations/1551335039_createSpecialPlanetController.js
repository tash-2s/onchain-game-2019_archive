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
    const userNormalPlanetIdCounterPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanetIdCounterPermanence"
    )
    const userSpecialPlanetPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserSpecialPlanetPermanence"
    )
    const userSpecialPlanetIdToOwnerPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserSpecialPlanetIdToOwnerPermanence"
    )

    const remarkableUsersAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "RemarkableUserController"
    )

    const controller = await helper.deployAndRegister(deployer, network, SpecialPlanetController, [
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdCounterPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      userSpecialPlanetIdToOwnerPermanenceAddress,
      userGoldPermanenceAddress,
      remarkableUsersAddress
    ])

    const UserGoldPermanence = new web3.eth.Contract(minterAdditionAbi, userGoldPermanenceAddress)
    await UserGoldPermanence.methods.addMinter(controller.address).send({ from: accounts[0] }) // TODO: 0 is right?

    const UserNormalPlanet = new web3.eth.Contract(
      minterAdditionAbi,
      userNormalPlanetPermanenceAddress
    )
    await UserNormalPlanet.methods.addMinter(controller.address).send({ from: accounts[0] })
    const UserNormalPlanetIdCounter = new web3.eth.Contract(
      minterAdditionAbi,
      userNormalPlanetIdCounterPermanenceAddress
    )
    await UserNormalPlanetIdCounter.methods
      .addMinter(controller.address)
      .send({ from: accounts[0] })

    await new web3.eth.Contract(minterAdditionAbi, userSpecialPlanetPermanenceAddress).methods
      .addMinter(controller.address)
      .send({ from: accounts[0] })
    await new web3.eth.Contract(
      minterAdditionAbi,
      userSpecialPlanetIdToOwnerPermanenceAddress
    ).methods
      .addMinter(controller.address)
      .send({ from: accounts[0] })
  })
}
