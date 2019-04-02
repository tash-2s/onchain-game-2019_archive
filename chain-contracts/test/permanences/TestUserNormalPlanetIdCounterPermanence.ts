contract("UserNormalPlanetIdCounterPermanence", async accounts => {
  const UserNormalPlanetIdCounterPermanence = artifacts.require(
    "UserNormalPlanetIdCounterPermanence"
  )
  let instance: PromiseGenericsType<ReturnType<typeof UserNormalPlanetIdCounterPermanence.deployed>>
  let ownerAccount: string
  let strangerAccount: string

  beforeEach(async () => {
    instance = await UserNormalPlanetIdCounterPermanence.deployed()
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
      await instance.update(strangerAccount, "123", { from: strangerAccount })
    } catch (_) {
      failed = true
    }

    assert.equal(failed, true)
  })

  it("should allow minters to update data", async () => {
    const result = await instance.update(strangerAccount, "123")
    assert.isOk(result)
  })

  it("should return updated data", async () => {
    const result1 = await instance.read(strangerAccount)
    assert.equal(result1.toString(), "123")

    const result2 = await instance.read(strangerAccount, { from: strangerAccount })
    assert.equal(result2.toString(), "123")
  })

  it("shouldn't affect other data", async () => {
    const result = await instance.read(ownerAccount)
    assert.equal(result.toString(), "0")
  })
})
