const {expectRevert} = require("@openzeppelin/test-helpers")

const InGameAsteriskPermanence = artifacts.require("InGameAsteriskPermanence")

describe("InGameAsteriskPermanence", () => {
  let owner, stranger, permanence

  beforeEach(async () => {
    const accounts = await web3.eth.getAccounts()
    owner = accounts[0]
    stranger = accounts[1]

    permanence = await InGameAsteriskPermanence.new()
  })

  describe("#read / #update", () => {
    const dummyData = "0x0000000000000000000000000000000000000000000000000000000000000001"

    it("should return 0x0 when data don't exist", async () => {
      const result = await permanence.read(123)
      assert.equal(result, "0x0000000000000000000000000000000000000000000000000000000000000000")
    })

    it("should revert when called by a non whitelisted account", async () => {
      await expectRevert(
        permanence.update(123, dummyData),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    it("should update and return data when called by a whitelisted account", async () => {
      await permanence.addWhitelisted(owner)
      await permanence.update(123, dummyData)
      const result = await permanence.read(123)
      assert.equal(result, dummyData)
    })
  })
})
