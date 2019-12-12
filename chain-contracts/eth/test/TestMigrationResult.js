const SpecialPlanetToken = artifacts.require("SpecialPlanetToken")
const SpecialPlanetTokenShop = artifacts.require("SpecialPlanetTokenShop")
const SpecialPlanetTokenShortIdGenerator = artifacts.require("SpecialPlanetTokenShortIdGenerator")

contract("Migration Result", function([admin, account]) {
  let token, shop, idGenerator

  before(async function() {
    token = await SpecialPlanetToken.deployed()
    shop = await SpecialPlanetTokenShop.deployed()
    idGenerator = await SpecialPlanetTokenShortIdGenerator.deployed()
  })

  it("should have correct relations", async function() {
    assert.equal(await shop.specialPlanetToken(), token.address)
    assert.equal(await shop.specialPlanetTokenShortIdGenerator(), idGenerator.address)
  })

  it("should have valid whitelisted accounts", async function() {
    assert.deepEqual(await getWhitelistedAccounts(token), [shop.address])
    assert.deepEqual(await getWhitelistedAccounts(shop), [admin])
    assert.deepEqual(await getWhitelistedAccounts(idGenerator), [shop.address])
  })

  it("should have valid whitelistAdmin accounts", async function() {
    assert.deepEqual(await getWhitelistAdminAccounts(token), [admin])
    assert.deepEqual(await getWhitelistAdminAccounts(shop), [admin])
    assert.deepEqual(await getWhitelistAdminAccounts(idGenerator), [admin])
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
