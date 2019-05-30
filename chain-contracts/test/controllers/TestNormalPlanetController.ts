contract("NormalPlanetController", async accounts => {
  const NormalPlanetController = artifacts.require("NormalPlanetController")
  const RemarkableUserController = artifacts.require("RemarkableUserController")
  const UserController = artifacts.require("UserController")
  const UserNormalPlanetPermanence = artifacts.require("UserNormalPlanetPermanence")
  const UserGoldPermanence = artifacts.require("UserGoldPermanence")

  let instance: PromiseGenericsType<ReturnType<typeof NormalPlanetController.deployed>>
  let ownerAccount: string
  let strangerAccount: string

  beforeEach(async () => {
    instance = await NormalPlanetController.deployed()
    ownerAccount = accounts[0]
    strangerAccount = accounts[1]
  })

  describe("#remarkableUserController()", async () => {
    it("should return a correct address", async () => {
      assert.equal(
        await instance.remarkableUserController(),
        (await RemarkableUserController.deployed()).address
      )
    })
  })

  describe("#setPlanet()", async () => {
    it("should set planets", async () => {
      await instance.setPlanet(1, 1, 0)
      await instance.setPlanet(2, -1, -2)

      const result = await (await UserController.deployed()).getUser(ownerAccount)

      assert.equal(result[0].toNumber(), 0)
      assert.deepEqual(result[2].map(e => e.toNumber()), [0, 1, 1, 2])
      assert.deepEqual(result[5].map(e => e.toNumber()), [1, 0, -1, -2])
    })
  })

  describe("#rankupPlanet()", async () => {
    context("time is not ok", async () => {
      it("should fail", async () => {
        let failed = false
        try {
          await instance.rankupPlanet(0, 2)
        } catch (_) {
          failed = true
        }
        assert.equal(failed, true)
      })
    })

    context("time is ok", async () => {
      it("should rankup a planet", async () => {
        await (await UserNormalPlanetPermanence.deployed()).pushElement(
          strangerAccount,
          "155000000010010010000100000000000000000000"
        )
        await (await UserGoldPermanence.deployed()).update(strangerAccount, 1000)

        const result1 = await (await UserController.deployed()).getUser(strangerAccount)
        assert.equal(result1[0].toNumber(), 1000)
        assert.equal(result1[3][0].toNumber(), 1)

        await instance.rankupPlanet(0, 2, { from: strangerAccount })

        const result2 = await (await UserController.deployed()).getUser(strangerAccount)
        assert.equal(result2[0].toNumber(), 0)
        assert.equal(result2[3][0].toNumber(), 2)
      })

      it("should bulk rankup a planet", async () => {
        await (await UserNormalPlanetPermanence.deployed()).pushElement(
          strangerAccount,
          "155000000300030030010200000000000000000001" // tech planet to add tech power (planet id: 102, rank: 30)
        )
        await (await UserGoldPermanence.deployed()).update(strangerAccount, 5187)
        await instance.rankupPlanet(0, 5, { from: strangerAccount })

        const result = await (await UserController.deployed()).getUser(strangerAccount)
        assert.equal(result[0].toNumber(), 0)
        assert.equal(result[3][0].toNumber(), 5)
      })
    })
  })

  describe("#removePlanet()", async () => {
    context("valid id", async () => {
      it("should remove the target", async () => {
        const result1 = await (await UserController.deployed()).getUser(ownerAccount)
        assert.deepEqual(result1[2].map(e => e.toNumber()), [0, 1, 1, 2])

        await instance.removePlanet(0)
        const result2 = await (await UserController.deployed()).getUser(ownerAccount)
        assert.deepEqual(result2[2].map(e => e.toNumber()), [1, 2])
      })
    })
  })
})
