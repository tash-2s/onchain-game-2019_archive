const {expectRevert} = require("@openzeppelin/test-helpers")

const UserNormalPlanetPermanence = artifacts.require("UserNormalPlanetPermanence")

describe("UserNormalPlanetPermanence", () => {
  let owner, stranger, permanence

  beforeEach(async () => {
    const accounts = await web3.eth.getAccounts()
    owner = accounts[0]
    stranger = accounts[1]

    permanence = await UserNormalPlanetPermanence.new()
  })

  context("when called by a non whitelisted account", () => {
    it("should return data for view calls", async () => {
      assert.equal((await permanence.read(owner)).length, 0)
      assert.equal((await permanence.count(owner)).toString(), "0")
      await expectRevert(permanence.readElement(owner, 0), "invalid opcode") // no data
    })

    it("should revert for state changes", async () => {
      const msg = "WhitelistedRole: caller does not have the Whitelisted role"

      await expectRevert(permanence.update(owner, ["0x1"]), msg)
      await expectRevert(permanence.updateElement(owner, 0, "0x1"), msg)
      await expectRevert(permanence.createElement(owner, "0x1"), msg)
      await expectRevert(permanence.deleteElement(owner, 0), msg)
    })
  })

  context("when called by a whitelisted account", () => {
    beforeEach(async () => {
      await permanence.addWhitelisted(owner)
    })

    it("should work", async () => {
      await permanence.update(owner, [
        "0x0000000000000000000000000000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000000000000000000000000000002"
      ])
      assert.deepEqual(await permanence.read(owner), [
        "0x0000000000000000000000000000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000000000000000000000000000002"
      ])
      assert.equal((await permanence.count(owner)).toString(), "2")
      await permanence.updateElement(
        owner,
        0,
        "0x0000000000000000000000000000000000000000000000000000000000000003"
      )
      assert.equal(
        await permanence.readElement(owner, 0),
        "0x0000000000000000000000000000000000000000000000000000000000000003"
      )
      await permanence.createElement(
        owner,
        "0x0000000000000000000000000000000000000000000000000000000000000004"
      )
      await permanence.deleteElement(owner, 1)
      assert.deepEqual(await permanence.read(owner), [
        "0x0000000000000000000000000000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000000000000000000000000000004"
      ])
    })
  })
})
