const {expectRevert, time, BN} = require("@openzeppelin/test-helpers")

const {
  buildInGameAsteriskPermanenceBytes32,
  buildUserGoldPermanenceBytes32
} = require("../helpers.js")

const InGameAsteriskController = artifacts.require("InGameAsteriskController")

const UserInGameAsteriskPermanence = artifacts.require("UserInGameAsteriskPermanence")
const UserInGameAsteriskIdGeneratorPermanence = artifacts.require(
  "UserInGameAsteriskIdGeneratorPermanence"
)
const UserTradableAsteriskPermanence = artifacts.require("UserTradableAsteriskPermanence")
const TradableAsteriskIdToDataPermanence = artifacts.require("TradableAsteriskIdToDataPermanence")
const UserGoldPermanence = artifacts.require("UserGoldPermanence")
const InGameAsteriskPermanence = artifacts.require("InGameAsteriskPermanence")

describe("InGameAsteriskController", function() {
  let admin, account, controller
  let userGoldPermanence

  beforeEach(async function() {
    const accounts = await web3.eth.getAccounts()
    admin = accounts[0]
    account = accounts[1]

    const [
      userInGameAsteriskPermanence,
      userInGameAsteriskIdGeneratorPermanence,
      userTradableAsteriskPermanence,
      tradableAsteriskIdToDataPermanence,
      _userGoldPermanence,
      inGameAsteriskPermanence
    ] = await Promise.all([
      UserInGameAsteriskPermanence.new(),
      UserInGameAsteriskIdGeneratorPermanence.new(),
      UserTradableAsteriskPermanence.new(),
      TradableAsteriskIdToDataPermanence.new(),
      UserGoldPermanence.new(),
      InGameAsteriskPermanence.new()
    ])

    userGoldPermanence = _userGoldPermanence

    controller = await InGameAsteriskController.new(
      userInGameAsteriskPermanence.address,
      userInGameAsteriskIdGeneratorPermanence.address,
      userTradableAsteriskPermanence.address,
      tradableAsteriskIdToDataPermanence.address,
      userGoldPermanence.address,
      inGameAsteriskPermanence.address
    )

    const needWhitelisted = [
      userInGameAsteriskPermanence,
      userInGameAsteriskIdGeneratorPermanence,
      userTradableAsteriskPermanence,
      tradableAsteriskIdToDataPermanence,
      userGoldPermanence
    ]
    await Promise.all(needWhitelisted.map(c => c.addWhitelisted(controller.address)))

    await inGameAsteriskPermanence.addWhitelisted(admin)
    await inGameAsteriskPermanence.update(1, buildInGameAsteriskPermanenceBytes32(1, 1, 1))
    await inGameAsteriskPermanence.update(2, buildInGameAsteriskPermanenceBytes32(2, 2, 2))

    InGameAsteriskController.defaults({from: account})
  })

  describe("#getAsterisks / #setAsterisks", function() {
    it("should return empty when data don't exist", async function() {
      const {
        confirmedGold,
        goldConfirmedAt,
        ids,
        ranks,
        times,
        coordinates
      } = await controller.getAsterisks(account)

      assert.strictEqual(confirmedGold.toString(), "0")
      assert.strictEqual(goldConfirmedAt.toString(), "0")
      assert.strictEqual(ids.length, 0)
      assert.strictEqual(ranks.length, 0)
      assert.strictEqual(times.length, 0)
      assert.strictEqual(coordinates.length, 0)
    })

    it("should return data when data exist", async function() {
      await controller.claimInitialGold()
      await controller.setAsterisks(1, [0, 1], [0, -1])

      const {
        confirmedGold,
        goldConfirmedAt,
        ids,
        ranks,
        times,
        coordinates
      } = await controller.getAsterisks(account)

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

  describe("#setAsterisks", function() {
    it("should set asterisks", async function() {
      await controller.claimInitialGold()

      await controller.setAsterisks(1, [0], [0])
      await controller.setAsterisks(2, [1], [1])

      const {confirmedGold, ids} = await controller.getAsterisks(account)

      assert.strictEqual(confirmedGold.toString(), "109890")
      assert.deepEqual(
        ids.map(e => e.toString()),
        ["1", "1", "2", "2"]
      )
    })

    it("should revert when asterisk id is invalid", async function() {
      await controller.claimInitialGold()
      await expectRevert(controller.setAsterisks(3, [0], [0]), "inGame asterisk: not found")
    })

    it("should revert when gold shortage", async function() {
      await expectRevert(controller.setAsterisks(1, [0], [0]), "not enough gold balance")
    })

    it("should revert when coordinates are already used", async function() {
      await controller.claimInitialGold()
      await controller.setAsterisks(1, [0], [0])
      await expectRevert(
        controller.setAsterisks(1, [1, 0], [1, 0]),
        "userInGameAsterisk: already used coordinates"
      )
    })

    it("should revert when coordinates are not in allowed radius", async function() {
      await controller.claimInitialGold()
      await expectRevert(controller.setAsterisks(1, [10], [-10]), "not allowed coordinate")
    })
  })

  describe("#rankupAsterisks", function() {
    it("should rankup asterisks", async function() {
      await controller.claimInitialGold()
      await controller.setAsterisks(1, [0, 0], [0, 1])
      await time.increase(300)

      await controller.rankupAsterisks([2], [2])

      const {confirmedGold, ranks} = await controller.getAsterisks(account)
      assert.strictEqual(confirmedGold.toString(), "109970")
      assert.deepEqual(
        ranks.map(e => e.toString()),
        ["1", "2"]
      )
    })

    it("should revert when the specified user asterisks don't exist", async function() {
      await controller.claimInitialGold()
      await controller.setAsterisks(1, [0, 0], [0, 1])
      await time.increase(300)

      await expectRevert(controller.rankupAsterisks([3], [2]), "user inGame asterisk: not found")
    })

    it("should revert when the specified rank is invalid", async function() {
      await controller.claimInitialGold()
      await controller.setAsterisks(1, [0, 0], [0, 1])
      await time.increase(300)

      await expectRevert(controller.rankupAsterisks([1], [1]), "invalid rank for rankup")
    })

    it("should revert when the time is not enough", async function() {
      await controller.claimInitialGold()
      await controller.setAsterisks(1, [0, 0], [0, 1])

      await expectRevert(controller.rankupAsterisks([2], [2]), "need more time to rankup")
      await expectRevert(
        controller.rankupAsterisks([2], [3]),
        "more knowledge is needed to bulk rankup"
      )
    })

    it("should revert when gold is insufficient", async function() {
      await updateGold(account, 20, (await time.latest()).toNumber())
      await controller.setAsterisks(1, [0, 0], [0, 1])
      await time.increase(300)

      await expectRevert(controller.rankupAsterisks([2], [2]), "not enough gold balance")
    })
  })

  describe("#removeAsterisks", function() {
    beforeEach(async function() {
      await controller.claimInitialGold()
      await controller.setAsterisks(1, [0, 0, 1], [0, 1, 0])
    })

    it("should remove asterisks", async function() {
      await controller.removeAsterisks([1, 3])
      const {ids} = await controller.getAsterisks(account)
      assert.deepEqual(
        ids.map(e => e.toString()),
        ["2", "1"]
      )
    })

    it("should revert when the spcified user asterisks don't exist", async function() {
      await expectRevert(controller.removeAsterisks([4]), "user inGame asterisk: not found")
    })
  })

  describe("#claimInitialGold", function() {
    it("should give gold", async function() {
      await controller.claimInitialGold()
      const {confirmedGold} = await controller.getAsterisks(account)
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
