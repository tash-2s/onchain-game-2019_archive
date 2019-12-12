const {expectRevert, time, BN} = require("@openzeppelin/test-helpers")

const {
  buildNormalPlanetPermanenceBytes32,
  buildUserGoldPermanenceBytes32
} = require("../helpers.js")

const NormalPlanetController = artifacts.require("NormalPlanetController")

const UserNormalPlanetPermanence = artifacts.require("UserNormalPlanetPermanence")
const UserNormalPlanetIdGeneratorPermanence = artifacts.require(
  "UserNormalPlanetIdGeneratorPermanence"
)
const UserSpecialPlanetPermanence = artifacts.require("UserSpecialPlanetPermanence")
const SpecialPlanetIdToDataPermanence = artifacts.require("SpecialPlanetIdToDataPermanence")
const UserGoldPermanence = artifacts.require("UserGoldPermanence")
const NormalPlanetPermanence = artifacts.require("NormalPlanetPermanence")

describe("NormalPlanetController", function() {
  let admin, account, controller
  let userGoldPermanence

  beforeEach(async function() {
    this.timeout(5000)

    const accounts = await web3.eth.getAccounts()
    admin = accounts[0]
    account = accounts[1]

    const [
      userNormalPlanetPermanence,
      userNormalPlanetIdGeneratorPermanence,
      userSpecialPlanetPermanence,
      specialPlanetIdToDataPermanence,
      _userGoldPermanence,
      normalPlanetPermanence
    ] = await Promise.all([
      UserNormalPlanetPermanence.new(),
      UserNormalPlanetIdGeneratorPermanence.new(),
      UserSpecialPlanetPermanence.new(),
      SpecialPlanetIdToDataPermanence.new(),
      UserGoldPermanence.new(),
      NormalPlanetPermanence.new()
    ])

    userGoldPermanence = _userGoldPermanence

    controller = await NormalPlanetController.new(
      userNormalPlanetPermanence.address,
      userNormalPlanetIdGeneratorPermanence.address,
      userSpecialPlanetPermanence.address,
      specialPlanetIdToDataPermanence.address,
      userGoldPermanence.address,
      normalPlanetPermanence.address
    )

    const needWhitelisted = [
      userNormalPlanetPermanence,
      userNormalPlanetIdGeneratorPermanence,
      userSpecialPlanetPermanence,
      specialPlanetIdToDataPermanence,
      userGoldPermanence
    ]
    await Promise.all(needWhitelisted.map(c => c.addWhitelisted(controller.address)))

    await normalPlanetPermanence.addWhitelisted(admin)
    await normalPlanetPermanence.update(1, buildNormalPlanetPermanenceBytes32(1, 1, 1))
    await normalPlanetPermanence.update(2, buildNormalPlanetPermanenceBytes32(2, 2, 2))

    NormalPlanetController.defaults({from: account})
  })

  describe("#getPlanets / #setPlanets", function() {
    it("should return empty when data don't exist", async function() {
      const {
        confirmedGold,
        goldConfirmedAt,
        ids,
        ranks,
        times,
        coordinates
      } = await controller.getPlanets(account)

      assert.strictEqual(confirmedGold.toString(), "0")
      assert.strictEqual(goldConfirmedAt.toString(), "0")
      assert.strictEqual(ids.length, 0)
      assert.strictEqual(ranks.length, 0)
      assert.strictEqual(times.length, 0)
      assert.strictEqual(coordinates.length, 0)
    })

    it("should return data when data exist", async function() {
      await controller.claimInitialGold()
      await controller.setPlanets(1, [0, 1], [0, -1])

      const {
        confirmedGold,
        goldConfirmedAt,
        ids,
        ranks,
        times,
        coordinates
      } = await controller.getPlanets(account)

      assert.strictEqual(confirmedGold.toString(), "109980")
      assert.notStrictEqual(goldConfirmedAt.toString(), "0")
      assert.deepEqual(
        ids.map(e => e.toString()),
        ["1", "1", "2", "1"]
      )
      assert.deepEqual(
        ranks.map(e => e.toString()),
        ["1", "1"]
      )

      assert.strictEqual(times.length, 4)
      assert.strictEqual(times[0].toString(), times[1].toString())
      const now = Math.floor(Date.now() / 1000)
      const timeSample = times[0].toNumber()
      assert.isAbove(timeSample, now - 10)
      assert.isBelow(timeSample, now + 10)

      assert.deepEqual(
        coordinates.map(e => e.toString()),
        ["0", "0", "1", "-1"]
      )
    })
  })

  describe("#setPlanets", function() {
    it("should set planets", async function() {
      await controller.claimInitialGold()

      await controller.setPlanets(1, [0], [0])
      await controller.setPlanets(2, [1], [1])

      const {confirmedGold, ids} = await controller.getPlanets(account)

      assert.strictEqual(confirmedGold.toString(), "109890")
      assert.deepEqual(
        ids.map(e => e.toString()),
        ["1", "1", "2", "2"]
      )
    })

    it("should revert when planet id is invalid", async function() {
      await controller.claimInitialGold()
      await expectRevert(controller.setPlanets(3, [0], [0]), "normal planet: not found")
    })

    it("should revert when gold shortage", async function() {
      await expectRevert(controller.setPlanets(1, [0], [0]), "not enough gold balance")
    })

    it("should revert when coordinates are already used", async function() {
      await controller.claimInitialGold()
      await controller.setPlanets(1, [0], [0])
      await expectRevert(
        controller.setPlanets(1, [1, 0], [1, 0]),
        "userNormalPlanet: already used coordinates"
      )
    })

    it("should revert when coordinates are not in allowed radius", async function() {
      await controller.claimInitialGold()
      await expectRevert(controller.setPlanets(1, [10], [-10]), "not allowed coordinate")
    })
  })

  describe("#rankupPlanets", function() {
    it("should rankup planets", async function() {
      await controller.claimInitialGold()
      await controller.setPlanets(1, [0, 0], [0, 1])
      await time.increase(300)

      await controller.rankupPlanets([2], [2])

      const {confirmedGold, ranks} = await controller.getPlanets(account)
      assert.strictEqual(confirmedGold.toString(), "109970")
      assert.deepEqual(
        ranks.map(e => e.toString()),
        ["1", "2"]
      )
    })

    it("should revert when the specified user planets don't exist", async function() {
      await controller.claimInitialGold()
      await controller.setPlanets(1, [0, 0], [0, 1])
      await time.increase(300)

      await expectRevert(controller.rankupPlanets([3], [2]), "user normal planet: not found")
    })

    it("should revert when the specified rank is invalid", async function() {
      await controller.claimInitialGold()
      await controller.setPlanets(1, [0, 0], [0, 1])
      await time.increase(300)

      await expectRevert(controller.rankupPlanets([1], [1]), "invalid rank for rankup")
    })

    it("should revert when the time is not enough", async function() {
      await controller.claimInitialGold()
      await controller.setPlanets(1, [0, 0], [0, 1])

      await expectRevert(controller.rankupPlanets([2], [2]), "need more time to rankup")
      await expectRevert(
        controller.rankupPlanets([2], [3]),
        "more knowledge is needed to bulk rankup"
      )
    })

    it("should revert when gold is insufficient", async function() {
      await updateGold(account, 20, (await time.latest()).toNumber())
      await controller.setPlanets(1, [0, 0], [0, 1])
      await time.increase(300)

      await expectRevert(controller.rankupPlanets([2], [2]), "not enough gold balance")
    })
  })

  describe("#removePlanets", function() {
    beforeEach(async function() {
      this.timeout(5000)
      await controller.claimInitialGold()
      await controller.setPlanets(1, [0, 0, 1], [0, 1, 0])
    })

    it("should remove planets", async function() {
      await controller.removePlanets([1, 3])
      const {ids} = await controller.getPlanets(account)
      assert.deepEqual(
        ids.map(e => e.toString()),
        ["2", "1"]
      )
    })

    it("should revert when the spcified user planets don't exist", async function() {
      await expectRevert(controller.removePlanets([4]), "user normal planet: not found")
    })
  })

  describe("#claimInitialGold", function() {
    it("should give gold", async function() {
      await controller.claimInitialGold()
      const {confirmedGold} = await controller.getPlanets(account)
      assert.strictEqual(confirmedGold.toString(), "110000")
    })

    it("should revert when not allowed", async function() {
      await controller.claimInitialGold()
      await expectRevert(controller.claimInitialGold(), "false condition for initial gold")
    })
  })

  const updateGold = async (account, balance, confirmedAt) => {
    await userGoldPermanence.addWhitelisted(admin)
    const bytes32 = buildUserGoldPermanenceBytes32(new BN(balance), new BN(confirmedAt))
    await userGoldPermanence.update(account, bytes32)
  }
})
