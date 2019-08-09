const helper = require("../migrationHelper")

const NormalPlanetController = artifacts.require("./controllers/NormalPlanetController") // TODO: fix

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
    const normalPlanetPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "NormalPlanetPermanence"
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

    const controller = await helper.deployAndRegister(deployer, network, NormalPlanetController, [
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdCounterPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      userSpecialPlanetIdToOwnerPermanenceAddress,
      userGoldPermanenceAddress,
      normalPlanetPermanenceAddress
    ])

    await new web3.eth.Contract(minterAdditionAbi, userGoldPermanenceAddress).methods
      .addMinter(controller.address)
      .send({ from: accounts[0] }) // TODO: 0 is right?

    await new web3.eth.Contract(minterAdditionAbi, userNormalPlanetPermanenceAddress).methods
      .addMinter(controller.address)
      .send({ from: accounts[0] })
    await new web3.eth.Contract(
      minterAdditionAbi,
      userNormalPlanetIdCounterPermanenceAddress
    ).methods
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
