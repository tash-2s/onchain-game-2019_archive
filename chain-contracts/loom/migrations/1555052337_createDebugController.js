const helper = require("../migrationHelper")

const DebugController = artifacts.require("./controllers/DebugController")

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
    if (network !== "local") {
      console.log("skip DebugController")
      return
    }
    console.log("\x1b[36m%s\x1b[0m", "deploying DEBUG contracts...") // color: cyan

    const userGoldPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserGoldPermanence"
    )
    const userInGameAsteriskPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserInGameAsteriskPermanence"
    )
    const userInGameAsteriskIdGeneratorPermanenceAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserInGameAsteriskIdGeneratorPermanence"
    )

    const controller = await deployer.deploy(
      DebugController,
      userGoldPermanenceAddress,
      userInGameAsteriskPermanenceAddress,
      userInGameAsteriskIdGeneratorPermanenceAddress
    )

    const UserGoldPermanence = new web3.eth.Contract(whitelistedABI, userGoldPermanenceAddress)
    await UserGoldPermanence.methods.addWhitelisted(controller.address).send({from: accounts[0]})

    const UserInGameAsterisk = new web3.eth.Contract(
      whitelistedABI,
      userInGameAsteriskPermanenceAddress
    )
    await UserInGameAsterisk.methods.addWhitelisted(controller.address).send({from: accounts[0]})

    const UserInGameAsteriskIdGenerator = new web3.eth.Contract(
      whitelistedABI,
      userInGameAsteriskIdGeneratorPermanenceAddress
    )
    await UserInGameAsteriskIdGenerator.methods
      .addWhitelisted(controller.address)
      .send({from: accounts[0]})
  })
}
