// controllers
const HighlightedUserController = artifacts.require("HighlightedUserController")
const InGameAsteriskController = artifacts.require("InGameAsteriskController")
const TradableAsteriskController = artifacts.require("TradableAsteriskController")

// misc
const TradableAsteriskTokenLocker = artifacts.require("TradableAsteriskTokenLocker")

// permanences
const InGameAsteriskPermanence = artifacts.require("InGameAsteriskPermanence")
const TradableAsteriskIdToDataPermanence = artifacts.require("TradableAsteriskIdToDataPermanence")
const UserGoldPermanence = artifacts.require("UserGoldPermanence")
const UserInGameAsteriskIdGeneratorPermanence = artifacts.require(
  "UserInGameAsteriskIdGeneratorPermanence"
)
const UserInGameAsteriskPermanence = artifacts.require("UserInGameAsteriskPermanence")
const UserTradableAsteriskPermanence = artifacts.require("UserTradableAsteriskPermanence")

// tokens
const TradableAsteriskToken = artifacts.require("TradableAsteriskToken")

contract("Migration Result", function([admin, account]) {
  let highlightedUserController, inGameAsteriskController, tradableAsteriskController
  let tradableAsteriskTokenLocker
  let inGameAsteriskPermanence,
    tradableAsteriskIdToDataPermanence,
    userGoldPermanence,
    userInGameAsteriskIdGeneratorPermanence,
    userInGameAsteriskPermanence,
    userTradableAsteriskPermanence
  let tradableAsteriskToken

  before(async function() {
    highlightedUserController = await HighlightedUserController.deployed()
    inGameAsteriskController = await InGameAsteriskController.deployed()
    tradableAsteriskController = await TradableAsteriskController.deployed()

    tradableAsteriskTokenLocker = await TradableAsteriskTokenLocker.deployed()

    inGameAsteriskPermanence = await InGameAsteriskPermanence.deployed()
    tradableAsteriskIdToDataPermanence = await TradableAsteriskIdToDataPermanence.deployed()
    userGoldPermanence = await UserGoldPermanence.deployed()
    userInGameAsteriskIdGeneratorPermanence = await UserInGameAsteriskIdGeneratorPermanence.deployed()
    userInGameAsteriskPermanence = await UserInGameAsteriskPermanence.deployed()
    userTradableAsteriskPermanence = await UserTradableAsteriskPermanence.deployed()

    tradableAsteriskToken = await TradableAsteriskToken.deployed()
  })

  it("should have correct relations", async function() {
    assert.equal(
      await tradableAsteriskTokenLocker.tradableAsteriskToken(),
      tradableAsteriskToken.address
    )
  })

  it("should have valid whitelisted accounts", async function() {
    assert.deepEqual(await getWhitelistedAccounts(tradableAsteriskTokenLocker), [
      tradableAsteriskController.address
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
