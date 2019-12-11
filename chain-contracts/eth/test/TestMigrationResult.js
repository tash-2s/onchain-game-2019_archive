const SpecialPlanetToken = artifacts.require("SpecialPlanetToken")
const SpecialPlanetTokenShop = artifacts.require("SpecialPlanetTokenShop")
const SpecialPlanetTokenShortIdGenerator = artifacts.require("SpecialPlanetTokenShortIdGenerator")

contract("Migration Result", function([deployer, stranger]) {
  before(async function() {
    this.token = await SpecialPlanetToken.deployed()
    this.shop = await SpecialPlanetTokenShop.deployed()
    this.idGenerator = await SpecialPlanetTokenShortIdGenerator.deployed()
  })

  it("should have correct relations", async function() {
    assert.equal(await this.shop.specialPlanetToken(), this.token.address)
    assert.equal(await this.shop.specialPlanetTokenShortIdGenerator(), this.idGenerator.address)
  })

  it("should have valid whitelisted accounts", async function() {
    assert.deepEqual(await getWhitelistedAccounts(this.token), [this.shop.address])
    assert.deepEqual(await getWhitelistedAccounts(this.shop), [deployer])
    assert.deepEqual(await getWhitelistedAccounts(this.idGenerator), [this.shop.address])
  })

  it("should have valid whitelistAdmin accounts", async function() {
    assert.deepEqual(await getWhitelistAdminAccounts(this.token), [deployer])
    assert.deepEqual(await getWhitelistAdminAccounts(this.shop), [deployer])
    assert.deepEqual(await getWhitelistAdminAccounts(this.idGenerator), [deployer])
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
