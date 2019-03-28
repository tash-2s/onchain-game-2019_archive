const UserNormalPlanetPermanence = artifacts.require("UserNormalPlanetPermanence")

contract("UserNormalPlanetPermanence", async accounts => {
  let instance: PromiseGenericsType<ReturnType<typeof UserNormalPlanetPermanence.deployed>>
  const ownerAccount = accounts[0]
  const strangerAccount = accounts[1]

  beforeEach(async () => {
    instance = await UserNormalPlanetPermanence.new({ from: ownerAccount })
  })

  describe("#isMinter()", async () => {
    context("when the account is the owner", async () => {
      it("should return true", async () => {
        const result = await instance.isMinter(ownerAccount)
        assert.equal(result, true)
      })
    })

    context("when the account is not the owner", async () => {
      it("should return false", async () => {
        const result = await instance.isMinter(strangerAccount)
        assert.equal(result, false)
      })
    })
  })

  describe("#read()", async () => {
    context("when the data is empty", async () => {
      it("should return an empty array", async () => {
        const result = await instance.read(ownerAccount)
        assert.equal(result.length, 0)
      })
    })

    context("when the data is not empty", async () => {
      it("should return a not empty array", async () => {
        await instance.addElement(ownerAccount, "123")
        const result = await instance.read(ownerAccount)
        assert.deepEqual(result.map(e => e.toString()), ["123"])
      })
    })
  })
})
