contract("PermanenceInterpretable", async accounts => {
  const PermanenceInterpretable = artifacts.require("PermanenceInterpretable")
  let instance: PromiseGenericsType<ReturnType<typeof PermanenceInterpretable.deployed>>

  before(async () => {
    instance = await PermanenceInterpretable.new({ from: accounts[0] })
  })

  describe("#interpretPermanenceUint256()", async () => {
    context("valid digit's args", async () => {
      it("should return a correct data", async () => {
        const fn = instance.interpretPermanenceUint256

        assert.equal((await fn(123456789, 4, 6)).toNumber(), 456)
        assert.equal((await fn(9, 1, 1)).toNumber(), 9)
        assert.equal((await fn(123456789, 1, 9)).toNumber(), 123456789)
        assert.equal((await fn(123456789, 8, 9)).toNumber(), 12)
        assert.equal((await fn(123456789, 10, 15)).toNumber(), 0)
        assert.equal((await fn(0, 2, 5)).toNumber(), 0)
      })
    })

    context("not valid digit's args", async () => {
      it("should throw an error", async () => {
        let failed = false
        try {
          await instance.interpretPermanenceUint256(123456789, 6, 5)
        } catch (_) {
          failed = true
        }
        assert.equal(failed, true)
      })
    })
  })

  describe("#reinterpretPermanenceUint256()", async () => {
    context("valid digit's args", async () => {
      it("should return a correct data", async () => {
        const fn = instance.reinterpretPermanenceUint256

        assert.equal((await fn(123456789, 4, 6, 999)).toNumber(), 123999789)
        assert.equal((await fn(123456789, 4, 6, 9)).toNumber(), 123009789)
        assert.equal((await fn(123456789, 1, 9, 111)).toNumber(), 111)
        assert.equal((await fn(9, 1, 1, 3)).toNumber(), 3)
        assert.equal((await fn(100, 2, 6, 3)).toNumber(), 30)
        assert.equal((await fn(100, 5, 10, 30)).toNumber(), 300100)
        assert.equal((await fn(0, 3, 5, 123)).toNumber(), 12300)
      })
    })

    context("not valid digit's args", async () => {
      it("should throw an error", async () => {
        let failed = false
        try {
          await instance.reinterpretPermanenceUint256(123456789, 6, 4, 999)
        } catch (_) {
          failed = true
        }
        assert.equal(failed, true)
      })
    })
  })
})
