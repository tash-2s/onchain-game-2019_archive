const {expectRevert, constants} = require("@openzeppelin/test-helpers")

const TradableAsteriskToken = artifacts.require("TradableAsteriskToken")

describe("TradableAsteriskToken", function() {
  let admin, account, token

  beforeEach(async function() {
    const accounts = await web3.eth.getAccounts()
    admin = accounts[0]
    account = accounts[1]

    token = await TradableAsteriskToken.new(constants.ZERO_ADDRESS)
  })

  describe("#mint", function() {
    it("should revert when called by a non whitelisted account", async function() {
      await expectRevert(
        token.mint(account, 1),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    it("should mint a asterisk when called by a whitelisted account", async function() {
      assert.equal((await token.balanceOf(account)).toString(), "0")
      await token.addWhitelisted(admin)

      await token.mint(account, 1)

      assert.equal((await token.balanceOf(account)).toString(), "1")
    })
  })

  describe("#updateTokenURIAffixes", function() {
    beforeEach(async function() {
      await token.addWhitelisted(account)
      await token.mint(account, 1, {from: account})
    })

    it("should revert when called by a non whitelisted account", async function() {
      await expectRevert(
        token.updateTokenURIAffixes("https://example.com/", ".json"),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    it("should mint a asterisk when called by a whitelisted account", async function() {
      await token.addWhitelisted(admin)
      assert.equal(
        await token.tokenURI(1),
        "https://example.com/tradable-asterisk-token-jsons/1.json"
      )

      await token.updateTokenURIAffixes("https://example.net/", ".json")

      assert.equal(await token.tokenURI(1), "https://example.net/1.json")
    })
  })

  describe("#tokensOfOwnerByIndex", function() {
    beforeEach(async function() {
      await token.addWhitelisted(admin)
      for (let i = 0; i < 10; i++) {
        await token.mint(admin, i + 1)
      }
    })

    it("should return tokens", async function() {
      const result1 = await token.tokensOfOwnerByIndex(admin, 0, 0)
      assert.equal(result1.length, 1)
      assert.equal(result1[0].toString(), "1")

      const result2 = await token.tokensOfOwnerByIndex(admin, 0, 4)
      assert.equal(result2.length, 5)
      assert.equal(result2[0].toString(), "1")
      assert.equal(result2[4].toString(), "5")

      const result3 = await token.tokensOfOwnerByIndex(admin, 8, 9)
      assert.equal(result3.length, 2)
      assert.equal(result3[0].toString(), "9")
      assert.equal(result3[1].toString(), "10")
    })
  })
})
