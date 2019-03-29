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
        await instance.pushElement(ownerAccount, "123")
        const result = await instance.read(ownerAccount)
        assert.deepEqual(result.map(e => e.toString()), ["123"])
      })
    })
  })

  describe("#update()", async () => {
    it("should update data", async () => {
      assert.deepEqual((await instance.read(ownerAccount)).map(e => e.toString()), [])
      await instance.update(ownerAccount, ["123", "456"])
      assert.deepEqual((await instance.read(ownerAccount)).map(e => e.toString()), ["123", "456"])
      await instance.update(ownerAccount, ["123"])
      assert.deepEqual((await instance.read(ownerAccount)).map(e => e.toString()), ["123"])
      await instance.update(ownerAccount, ["123", "456", "789"])
      assert.deepEqual((await instance.read(ownerAccount)).map(e => e.toString()), [
        "123",
        "456",
        "789"
      ])
    })

    it("should not allow strangers to update data", async () => {
      let failed1 = false
      try {
        await instance.update(ownerAccount, ["123"], { from: strangerAccount })
      } catch (_) {
        failed1 = true
      }
      assert.equal(failed1, true)

      let failed2 = false
      try {
        await instance.update(strangerAccount, ["123"], { from: strangerAccount })
      } catch (_) {
        failed2 = true
      }
      assert.equal(failed2, true)
    })
  })

  describe("#pushElement()", async () => {
    it("should not allow strangers to push an element", async () => {
      let failed = false
      try {
        await instance.pushElement(strangerAccount, "123", { from: strangerAccount })
      } catch (_) {
        failed = true
      }
      assert.equal(failed, true)
    })

    it("should push an element", async () => {
      await instance.pushElement(strangerAccount, "123")
      assert.deepEqual((await instance.read(strangerAccount)).map(e => e.toString()), ["123"])
    })

    it("should handle big int", async () => {
      await instance.pushElement(
        strangerAccount,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      ) // max
      await instance.pushElement(
        strangerAccount,
        "115792089237316195423570985008687907853269984665640564039457584007913129639936"
      ) // max + 1
      await instance.pushElement(strangerAccount, "-1")

      assert.deepEqual((await instance.read(strangerAccount)).map(e => e.toString()), [
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
        "0",
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      ])
    })
  })

  describe("#readByIndex()", async () => {
    it("should return an element based on the index", async () => {
      await instance.update(ownerAccount, ["1", "2", "3"])
      assert.equal((await instance.readByIndex(ownerAccount, 0)).toString(), "1")
      assert.equal((await instance.readByIndex(ownerAccount, 2)).toString(), "3")
    })
  })

  describe("#updateByIndex()", async () => {
    beforeEach(async () => {
      await instance.update(ownerAccount, ["1", "2"])
    })

    it("should not allow strangers to update an element", async () => {
      let failed = false
      try {
        await instance.updateByIndex(ownerAccount, 0, "9", { from: strangerAccount })
      } catch (_) {
        failed = true
      }
      assert.equal(failed, true)
    })

    it("should update an element based on the index", async () => {
      await instance.updateByIndex(ownerAccount, 0, "9")
      assert.deepEqual((await instance.read(ownerAccount)).map(e => e.toString()), ["9", "2"])
    })
  })

  describe("#arrayLength()", async () => {
    it("should return the length of an array", async () => {
      assert.equal((await instance.arrayLength(strangerAccount)).toString(), "0")

      await instance.update(strangerAccount, ["0", "1", "2", "3"])
      assert.equal((await instance.arrayLength(strangerAccount)).toString(), "4")

      await instance.update(strangerAccount, ["0"])
      assert.equal((await instance.arrayLength(strangerAccount)).toString(), "1")
    })
  })
})
