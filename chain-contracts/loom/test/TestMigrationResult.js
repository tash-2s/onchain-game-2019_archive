// controllers
const HighlightedUserController = artifacts.require("HighlightedUserController")
const NormalPlanetController = artifacts.require("NormalPlanetController")
const SpecialPlanetController = artifacts.require("SpecialPlanetController")

// misc
const SpecialPlanetTokenLocker = artifacts.require("SpecialPlanetTokenLocker")

// permanences
const NormalPlanetPermanence = artifacts.require("NormalPlanetPermanence")
const SpecialPlanetIdToDataPermanence = artifacts.require("SpecialPlanetIdToDataPermanence")
const UserGoldPermanence = artifacts.require("UserGoldPermanence")
const UserNormalPlanetIdGeneratorPermanence = artifacts.require(
  "UserNormalPlanetIdGeneratorPermanence"
)
const UserNormalPlanetPermanence = artifacts.require("UserNormalPlanetPermanence")
const UserSpecialPlanetPermanence = artifacts.require("UserSpecialPlanetPermanence")

// tokens
const SpecialPlanetToken = artifacts.require("SpecialPlanetToken")

contract("Migration Result", function([admin, account]) {
  let highlightedUserController, normalPlanetController, specialPlanetController
  let specialPlanetTokenLocker
  let normalPlanetPermanence,
    specialPlanetIdToDataPermanence,
    userGoldPermanence,
    userNormalPlanetIdGeneratorPermanence,
    userNormalPlanetPermanence,
    userSpecialPlanetPermanence
  let specialPlanetToken

  before(async function() {
    highlightedUserController = await HighlightedUserController.deployed()
    normalPlanetController = await NormalPlanetController.deployed()
    specialPlanetController = await SpecialPlanetController.deployed()

    specialPlanetTokenLocker = await SpecialPlanetTokenLocker.deployed()

    normalPlanetPermanence = await NormalPlanetPermanence.deployed()
    specialPlanetIdToDataPermanence = await SpecialPlanetIdToDataPermanence.deployed()
    userGoldPermanence = await UserGoldPermanence.deployed()
    userNormalPlanetIdGeneratorPermanence = await UserNormalPlanetIdGeneratorPermanence.deployed()
    userNormalPlanetPermanence = await UserNormalPlanetPermanence.deployed()
    userSpecialPlanetPermanence = await UserSpecialPlanetPermanence.deployed()

    specialPlanetToken = await SpecialPlanetToken.deployed()
  })

  it("should have correct relations", async function() {
    assert.equal(await specialPlanetTokenLocker.specialPlanetToken(), specialPlanetToken.address)
  })

  it("should have valid whitelisted accounts", async function() {
    assert.deepEqual(await getWhitelistedAccounts(specialPlanetTokenLocker), [
      specialPlanetController.address
    ])
  })
})

const whitelistEventABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "WhitelistAdminAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "WhitelistedAdded",
    type: "event"
  }
]

const getWhitelistedAccounts = async truffleContract => {
  return await _getWhitelistAccounts(truffleContract, "WhitelistedAdded")
}

const getWhitelistAdminAccounts = async truffleContract => {
  return await _getWhitelistAccounts(truffleContract, "WhitelistAdminAdded")
}

const _getWhitelistAccounts = async (truffleContract, eventName) => {
  const web3Contract = new web3.eth.Contract(whitelistEventABI, truffleContract.address)
  return (await web3Contract.getPastEvents(eventName, {fromBlock: 0, toBlock: "latest"})).map(
    e => e.returnValues.account
  )
}
