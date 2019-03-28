const NormalPlanetPermanence = artifacts.require("NormalPlanetPermanence")

contract("NormalPlanetPermanence", async accounts => {
  let instance: PromiseGenericsType<ReturnType<typeof NormalPlanetPermanence.deployed>>
  let ownerAccount: string
  let strangerAccount: string

  beforeEach(async () => {
    instance = await NormalPlanetPermanence.deployed()
    ownerAccount = accounts[0]
    strangerAccount = accounts[1]
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

  it("should return 0 when data doesn't exist", async () => {
    const result = await instance.read(ownerAccount)
    assert.equal(result.toString(), "0")
  })

  it("should not allow strangers to update data", async () => {
    let failed = false

    try {
      await instance.update("123", "456", { from: strangerAccount })
    } catch (_) {
      failed = true
    }

    assert.equal(failed, true)
  })

  it("should allow minters to update data", async () => {
    const result = await instance.update("123", "456")
    assert.isOk(result)
  })

  it("should return updated data", async () => {
    const result1 = await instance.read("123")
    assert.equal(result1.toString(), "456")

    const result2 = await instance.read("123", { from: strangerAccount })
    assert.equal(result2.toString(), "456")
  })

  it("shouldn't affect other data", async () => {
    const result = await instance.read("1234")
    assert.equal(result.toString(), "0")
  })
})
