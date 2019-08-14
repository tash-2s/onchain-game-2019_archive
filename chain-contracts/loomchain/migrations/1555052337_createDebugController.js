const helper = require("../migrationHelper")

const DebugController = artifacts.require("./controllers/DebugController")

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
    if (network !== "loom_local") {
      console.log("skip DebugController")
      return
    }
    console.log("\x1b[36m%s\x1b[0m", "deploying DEBUG contracts...") // color: cyan

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

    const controller = await deployer.deploy(
      DebugController,
      userGoldPermanenceAddress,
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdCounterPermanenceAddress
    )

    const UserGoldPermanence = new web3.eth.Contract(minterAdditionAbi, userGoldPermanenceAddress)
    await UserGoldPermanence.methods.addMinter(controller.address).send({ from: accounts[0] })

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
  })
}
