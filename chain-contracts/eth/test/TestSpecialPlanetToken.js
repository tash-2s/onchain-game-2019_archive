const {expectRevert, constants} = require("@openzeppelin/test-helpers")

const SpecialPlanetToken = artifacts.require("SpecialPlanetToken")

describe("SpecialPlanetToken", function() {
  beforeEach(async function() {
    const accounts = await web3.eth.getAccounts()
    this.deployer = accounts[0]
    this.stranger = accounts[1]

    this.token = await SpecialPlanetToken.new(constants.ZERO_ADDRESS)
  })

  describe("#mint", function() {
    it("should revert when called by a non whitelisted account", async function() {
      await expectRevert(
        this.token.mint(this.stranger, 1),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    it("should mint a planet when called by a whitelisted account", async function() {
      assert.equal((await this.token.balanceOf(this.stranger)).toString(), "0")
      await this.token.addWhitelisted(this.deployer)

      await this.token.mint(this.stranger, 1)

      assert.equal((await this.token.balanceOf(this.stranger)).toString(), "1")
    })
  })

  describe("#updateTokenURIAffixes", function() {
    beforeEach(async function() {
      await this.token.addWhitelisted(this.stranger)
      await this.token.mint(this.stranger, 1, {from: this.stranger})
    })

    it("should revert when called by a non whitelisted account", async function() {
      await expectRevert(
        this.token.updateTokenURIAffixes("https://example.com/", ".json"),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    it("should mint a planet when called by a whitelisted account", async function() {
      await this.token.addWhitelisted(this.deployer)
      assert.equal(
        await this.token.tokenURI(1),
        "https://d3fivknrylrhff.cloudfront.net/special-planet-token-jsons/1.json"
      )

      await this.token.updateTokenURIAffixes("https://example.com/", ".json")

      assert.equal(await this.token.tokenURI(1), "https://example.com/1.json")
    })
  })

  describe("#tokensOfOwnerByIndex", function() {
    beforeEach(async function() {
      await this.token.addWhitelisted(this.deployer)
      for (let i = 0; i < 10; i++) {
        await this.token.mint(this.deployer, i + 1)
      }
    })

    it("should return tokens", async function() {
      const result1 = await this.token.tokensOfOwnerByIndex(this.deployer, 0, 0)
      assert.equal(result1.length, 1)
      assert.equal(result1[0].toString(), "1")

      const result2 = await this.token.tokensOfOwnerByIndex(this.deployer, 0, 4)
      assert.equal(result2.length, 5)
      assert.equal(result2[0].toString(), "1")
      assert.equal(result2[4].toString(), "5")

      const result3 = await this.token.tokensOfOwnerByIndex(this.deployer, 8, 9)
      assert.equal(result3.length, 2)
      assert.equal(result3[0].toString(), "9")
      assert.equal(result3[1].toString(), "10")
    })
  })
})
