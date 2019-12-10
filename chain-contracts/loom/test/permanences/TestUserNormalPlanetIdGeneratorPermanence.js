const {expectRevert} = require("@openzeppelin/test-helpers")

const UserNormalPlanetIdGeneratorPermanence = artifacts.require(
  "UserNormalPlanetIdGeneratorPermanence"
)

describe("UserNormalPlanetIdGeneratorPermanence", () => {
  let owner, stranger, permanence

  beforeEach(async () => {
    const accounts = await web3.eth.getAccounts()
    owner = accounts[0]
    stranger = accounts[1]

    permanence = await UserNormalPlanetIdGeneratorPermanence.new()
  })

  describe("#read / #update", () => {
    it("should return 0 when data don't exist", async () => {
      const result = await permanence.read(owner)
      assert.equal(result.toString(), "0")
    })

    it("should revert when called by a non whitelisted account", async () => {
      await expectRevert(
        permanence.update(owner, 1),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    it("should update and return data when called by a whitelisted account", async () => {
      await permanence.addWhitelisted(owner)
      await permanence.update(owner, 1)
      const result = await permanence.read(owner)
      assert.equal(result.toString(), "1")
    })
  })

  describe("#generate", () => {
    it("should revert when called by a non whitelisted account", async () => {
      await expectRevert(
        permanence.generate(owner, 1),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    it("should generate ids when called by a whitelisted account", async () => {
      await permanence.addWhitelisted(owner)

      await permanence.generate(owner, 1)
      assert.equal((await permanence.read(owner)).toString(), "1")

      await permanence.generate(owner, 3)
      assert.equal((await permanence.read(owner)).toString(), "4")
    })
  })
})
