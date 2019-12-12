const {expectRevert} = require("@openzeppelin/test-helpers")

const SpecialPlanetController = artifacts.require("SpecialPlanetController")

const SpecialPlanetToken = artifacts.require("SpecialPlanetToken")
const UserNormalPlanetPermanence = artifacts.require("UserNormalPlanetPermanence")
const UserSpecialPlanetPermanence = artifacts.require("UserSpecialPlanetPermanence")
const SpecialPlanetIdToDataPermanence = artifacts.require("SpecialPlanetIdToDataPermanence")
const UserGoldPermanence = artifacts.require("UserGoldPermanence")
const HighlightedUserController = artifacts.require("HighlightedUserController")
const SpecialPlanetTokenLocker = artifacts.require("SpecialPlanetTokenLocker")

describe("SpecialPlanetController", function() {
  let admin, account, controller
  let token, locker

  beforeEach(async function() {
    const accounts = await web3.eth.getAccounts()
    admin = accounts[0]
    account = accounts[1]

    const [userGoldPermanence, specialPlanetToken] = await Promise.all([
      UserGoldPermanence.new(),
      SpecialPlanetToken.new(admin)
    ])

    const [
      userNormalPlanetPermanence,
      userSpecialPlanetPermanence,
      specialPlanetIdToDataPermanence,
      highlightedUserController,
      specialPlanetTokenLocker
    ] = await Promise.all([
      UserNormalPlanetPermanence.new(),
      UserSpecialPlanetPermanence.new(),
      SpecialPlanetIdToDataPermanence.new(),
      HighlightedUserController.new(userGoldPermanence.address),
      SpecialPlanetTokenLocker.new(specialPlanetToken.address)
    ])

    controller = await SpecialPlanetController.new(
      userNormalPlanetPermanence.address,
      userSpecialPlanetPermanence.address,
      specialPlanetIdToDataPermanence.address,
      userGoldPermanence.address,
      highlightedUserController.address,
      specialPlanetTokenLocker.address
    )
    token = specialPlanetToken
    locker = specialPlanetTokenLocker

    const needWhitelisted = [
      userNormalPlanetPermanence,
      userSpecialPlanetPermanence,
      specialPlanetIdToDataPermanence,
      userGoldPermanence,
      specialPlanetTokenLocker
    ]
    await Promise.all(needWhitelisted.map(c => c.addWhitelisted(controller.address)))
  })

  const tokenId1 = "34749996825048652972155" // shortId:123,version:1,kind:2,paramRate:15,artSeed:123456789
  const tokenId2 = "2779999770033034637608146" // shortId:1234,version:1,kind:1,paramRate:15,artSeed:9876543210

  describe("#getPlanets / #setPlanet", function() {
    it("should return empty when data don't exist", async function() {
      const {
        confirmedGold,
        goldConfirmedAt,
        ids,
        kinds,
        paramRates,
        times,
        coordinates,
        artSeeds
      } = await controller.getPlanets(admin)

      assert.strictEqual(confirmedGold.toString(), "0")
      assert.strictEqual(goldConfirmedAt.toString(), "0")
      assert.strictEqual(ids.length, 0)
      assert.strictEqual(kinds.length, 0)
      assert.strictEqual(paramRates.length, 0)
      assert.strictEqual(times.length, 0)
      assert.strictEqual(coordinates.length, 0)
      assert.strictEqual(artSeeds.length, 0)
    })

    it("should return data when data exist", async function() {
      await token.mintToGateway(tokenId1)
      await token.setApprovalForAll(locker.address, true)

      await controller.setPlanet(tokenId1, 0, 1)

      const {
        confirmedGold,
        goldConfirmedAt,
        ids,
        kinds,
        paramRates,
        times,
        coordinates,
        artSeeds
      } = await controller.getPlanets(admin)

      assert.strictEqual(confirmedGold.toString(), "0")
      assert.notEqual(goldConfirmedAt.toString(), "0")
      assert.deepEqual(
        ids.map(e => e.toString()),
        ["123"]
      )
      assert.deepEqual(
        kinds.map(e => e.toString()),
        ["2"]
      )
      assert.deepEqual(
        paramRates.map(e => e.toString()),
        ["15"]
      )
      assert.strictEqual(times.length, 2)
      assert.deepEqual(
        coordinates.map(e => e.toString()),
        ["0", "1"]
      )
      assert.deepEqual(
        artSeeds.map(e => e.toString()),
        ["123456789"]
      )
    })
  })

  describe("#setPlanet", function() {
    it("should set planet", async function() {
      await token.mintToGateway(tokenId1)
      await token.setApprovalForAll(locker.address, true)

      assert.strictEqual(await token.ownerOf(tokenId1), admin)

      await controller.setPlanet(tokenId1, 0, 1)

      assert.strictEqual(await token.ownerOf(tokenId1), locker.address)

      await token.mintToGateway(tokenId2)
      await controller.setPlanet(tokenId2, 1, 0)
    })

    it("should revert when caller doesn't have the planet", async function() {
      await token.mintToGateway(tokenId1)
      await token.safeTransferFrom(admin, account, tokenId1)

      await expectRevert(controller.setPlanet(tokenId1, 0, 1), "locker: wrong owner")
    })

    it("should revert when coordinates are already used", async function() {
      await token.mintToGateway(tokenId1)
      await token.mintToGateway(tokenId2)
      await token.setApprovalForAll(locker.address, true)
      await controller.setPlanet(tokenId1, 0, 1)

      await expectRevert(
        controller.setPlanet(tokenId2, 0, 1),
        "userSpecialPlanet: already used coordinates"
      )
    })

    it("should revert when coordinates are not in allowed radius", async function() {
      await token.mintToGateway(tokenId1)
      await token.setApprovalForAll(locker.address, true)

      await expectRevert(controller.setPlanet(tokenId1, 3, -3), "not allowed coordinate")
    })
  })

  describe("#removePlanet", function() {
    it("should set planet", async function() {
      await token.mintToGateway(tokenId1)
      await token.setApprovalForAll(locker.address, true)
      await controller.setPlanet(tokenId1, 0, 1)

      assert.strictEqual((await controller.getPlanets(admin)).ids.length, 1)
      assert.strictEqual(await token.ownerOf(tokenId1), locker.address)

      await controller.removePlanet(123)

      assert.strictEqual((await controller.getPlanets(admin)).ids.length, 0)
      assert.strictEqual(await token.ownerOf(tokenId1), admin)
    })

    it("should revert when the short id is wrong", async function() {
      await token.mintToGateway(tokenId1)
      await token.setApprovalForAll(locker.address, true)
      await controller.setPlanet(tokenId1, 0, 1)

      await expectRevert(controller.removePlanet(1234), "locker: wrong owner or id")
    })
  })
})
