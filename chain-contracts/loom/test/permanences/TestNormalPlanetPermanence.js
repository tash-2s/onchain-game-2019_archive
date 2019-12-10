const {expectRevert} = require("@openzeppelin/test-helpers")

const NormalPlanetPermanence = artifacts.require("NormalPlanetPermanence")

describe("NormalPlanetPermanence", () => {
  let owner, stranger, permanence

  beforeEach(async () => {
    const accounts = await web3.eth.getAccounts()
    owner = accounts[0]
    stranger = accounts[1]

    permanence = await NormalPlanetPermanence.new()
  })

  describe("#read / #update", () => {
    it("should return 0x0 when data don't exist", async () => {
      const result = await permanence.read(123)
      assert.equal(result, "0x0000000000000000000000000000000000000000000000000000000000000000")
    })

    it("should revert when called by a non whitelisted account", async () => {
      await expectRevert(
        permanence.update(123, "0x1"),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    it("should return data when called by a whitelisted account", async () => {
      await permanence.addWhitelisted(owner)
      await permanence.update(
        123,
        "0x0000000000000000000000000000000000000000000000000000000000000001"
      )
      const result = await permanence.read(123)
      assert.equal(result, "0x0000000000000000000000000000000000000000000000000000000000000001")
    })
  })
})
