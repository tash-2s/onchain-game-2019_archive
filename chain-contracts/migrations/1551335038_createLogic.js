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

    const goldAddress = await helper.getRegistryContractAddress(deployer.network_id, "Gold")
    const normalPlanetAddress = await helper.getRegistryContractAddress(deployer.network_id, "NormalPlanet")
    const userNormalPlanetAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanet"
    )
    const remarkableUsersAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "RemarkableUsers"
    )

    const logic = await helper.deployAndRegister(deployer, network, Logic, [
      goldAddress,
      normalPlanetAddress,
      userNormalPlanetAddress,
      remarkableUsersAddress
    ])

    const Gold = new web3.eth.Contract(minterAdditionAbi, goldAddress)
    await Gold.methods.addMinter(logic.address).send({ from: accounts[0] }) // TODO: 0 is right?
    const UserNormalPlanet = new web3.eth.Contract(minterAdditionAbi, userNormalPlanetAddress)
    await UserNormalPlanet.methods.addMinter(logic.address).send({ from: accounts[0] })
  })
}
