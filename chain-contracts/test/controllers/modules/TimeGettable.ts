const TimeGettable = artifacts.require("TimeGettable")

contract("TimeGettable", async accounts => {
  let instance: PromiseGenericsType<ReturnType<typeof TimeGettable.deployed>>

  before(async () => {
    instance = await TimeGettable.new({ from: accounts[0] })
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
