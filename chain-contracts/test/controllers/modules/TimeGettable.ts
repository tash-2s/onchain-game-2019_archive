const TimeGettable = artifacts.require("TimeGettable")

contract("TimeGettable", async accounts => {
  let instance: PromiseGenericsType<ReturnType<typeof TimeGettable.deployed>>
  const ownerAccount = accounts[0]
  const strangerAccount = accounts[1]

  beforeEach(async () => {
    instance = await TimeGettable.new({ from: ownerAccount })
  })

  describe("#uint32now()", async () => {
    it("should return a unixtime", async () => {
      const unixtimeNow = Math.floor(Date.now() / 1000)
      const result = await instance.uint32now()

      assert.isAbove(result.toNumber(), unixtimeNow - 5)
      assert.isBelow(result.toNumber(), unixtimeNow + 5)
    })
  })
})
