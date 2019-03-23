const helper = require("../migrationHelper")

const Logic = artifacts.require("Logic") // TODO: fix

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
    const utilAddress = await helper.getRegistryContractAddress(deployer.network_id, "Util")
    const readerAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanetArrayReader"
    )
    Logic.setNetwork(deployer.network_id)
    Logic.link("Util", utilAddress)
    Logic.link("UserNormalPlanetArrayReader", readerAddress)

    const userGoldPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserGoldPermanence"
    )
    const normalPlanetPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "NormalPlanetPermanence"
    )
    const userNormalPlanetAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanet"
    )
    const remarkableUsersAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "RemarkableUsers"
    )

    const logic = await helper.deployAndRegister(deployer, network, Logic, [
      userGoldPermanenceAddress,
      normalPlanetPermanenceAddress,
      userNormalPlanetAddress,
      remarkableUsersAddress
    ])

    const UserGoldPermanence = new web3.eth.Contract(minterAdditionAbi, userGoldPermanenceAddress)
    await UserGoldPermanence.methods.addMinter(logic.address).send({ from: accounts[0] }) // TODO: 0 is right?
    const UserNormalPlanet = new web3.eth.Contract(minterAdditionAbi, userNormalPlanetAddress)
    await UserNormalPlanet.methods.addMinter(logic.address).send({ from: accounts[0] })
  })
}
