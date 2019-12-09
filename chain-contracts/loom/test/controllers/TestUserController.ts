contract("UserController", async accounts => {
  const UserController = artifacts.require("UserController")
  const NormalPlanetController = artifacts.require("NormalPlanetController")

  let instance: PromiseGenericsType<ReturnType<typeof UserController.deployed>>
  let ownerAccount: string
  let strangerAccount: string

  beforeEach(async () => {
    instance = await UserController.deployed()
    ownerAccount = accounts[0]
    strangerAccount = accounts[1]
  })

  describe("#getUser()", async () => {
    context("not used account", async () => {
      it("should return empties", async () => {
        const result = await instance.getUser(strangerAccount)

        assert.equal(result[0].toString(), "0")
        assert.equal(result[1].toString(), "0")
        assert.equal(result[2].length, 0)
        assert.equal(result[3].length, 0)
        assert.equal(result[4].length, 0)
        assert.equal(result[5].length, 0)
      })
    })

    context("used account", async () => {
      it("should return data", async () => {
        const normalPlanetController = await NormalPlanetController.deployed()
        const unixtimeNow = Math.floor(Date.now() / 1000)
        await normalPlanetController.setPlanet(1, 2, -3)

        const result = await instance.getUser(ownerAccount)

        assert.equal(result[0].toString(), "1000")
        assert.isAbove(result[1].toNumber(), unixtimeNow - 10)
        assert.isBelow(result[1].toNumber(), unixtimeNow + 10)
        assert.deepEqual(
          result[2].map(e => e.toString()),
          ["0", "1"]
        )
        assert.deepEqual(
          result[3].map(e => e.toString()),
          ["1"]
        )
        assert.isAbove(result[4][0].toNumber(), unixtimeNow - 10)
        assert.deepEqual(
          result[5].map(e => e.toString()),
          ["2", "-3"]
        )
      })

      it("should return more data", async () => {
        const normalPlanetController = await NormalPlanetController.deployed()
        const unixtimeNow = Math.floor(Date.now() / 1000)
        await normalPlanetController.setPlanet(2, -123, 456)

        const result = await instance.getUser(ownerAccount)

        assert.equal(result[0].toString(), "0")
        assert.isAbove(result[1].toNumber(), unixtimeNow - 10)
        assert.isBelow(result[1].toNumber(), unixtimeNow + 10)
        assert.deepEqual(
          result[2].map(e => e.toString()),
          ["0", "1", "1", "2"]
        )
        assert.deepEqual(
          result[3].map(e => e.toString()),
          ["1", "1"]
        )
        assert.isAbove(result[4][3].toNumber(), unixtimeNow - 10)
        assert.deepEqual(
          result[5].map(e => e.toString()),
          ["2", "-3", "-123", "456"]
        )
      })
    })
  })
})
