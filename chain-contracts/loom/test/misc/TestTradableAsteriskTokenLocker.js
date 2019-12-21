const {expectRevert} = require("@openzeppelin/test-helpers")

const TradableAsteriskTokenLocker = artifacts.require("TradableAsteriskTokenLocker")
const TradableAsteriskToken = artifacts.require("TradableAsteriskToken")

describe("TradableAsteriskTokenLocker", function() {
  let admin, account, token, locker

  beforeEach(async function() {
    const accounts = await web3.eth.getAccounts()
    admin = accounts[0]
    account = accounts[1]

    token = await TradableAsteriskToken.new(admin)
    locker = await TradableAsteriskTokenLocker.new(token.address)
  })

  describe("#lock", function() {
    beforeEach(async function() {
      await token.setApprovalForAll(locker.address, true)
    })

    it("should revert when called by a non whitelisted account", async function() {
      await expectRevert(
        locker.lock(admin, 1),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    context("when called by a whitelisted account", async function() {
      beforeEach(async function() {
        locker.addWhitelisted(admin)
      })

      const tokenId = "2779999770033034637607035" // shortId: 123

      it("should revert when the owner is worng", async function() {
        await token.mintToGateway(tokenId)
        await token.safeTransferFrom(admin, account, tokenId)

        await expectRevert(locker.lock(admin, tokenId), "locker: wrong owner")
      })

      it("should lock the token", async function() {
        await token.mintToGateway(tokenId)

        assert.strictEqual((await token.balanceOf(admin)).toString(), "1")
        assert.strictEqual((await token.balanceOf(locker.address)).toString(), "0")

        await locker.lock(admin, tokenId)

        assert.strictEqual((await token.balanceOf(admin)).toString(), "0")
        assert.strictEqual((await token.balanceOf(locker.address)).toString(), "1")

        assert.strictEqual((await locker.shortIdToTokenId("123")).toString(), tokenId)
        assert.strictEqual(await locker.tokenIdToOwner(tokenId), admin)
      })
    })
  })

  describe("#unlock", function() {
    it("should revert when called by a non whitelisted account", async function() {
      await expectRevert(
        locker.unlock(admin, 1),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    context("when called by a whitelisted account", async function() {
      beforeEach(async function() {
        locker.addWhitelisted(admin)
      })

      const tokenId = "2779999770033034637607035" // shortId: 123

      it("should revert when the owner doesn't have the token", async function() {
        await token.mintToGateway(tokenId)
        await token.safeTransferFrom(admin, account, tokenId)
        await token.setApprovalForAll(locker.address, true, {from: account})
        await locker.lock(account, tokenId)

        await expectRevert(locker.unlock(admin, 123), "locker: wrong owner or id")
      })

      it("should unlock the token", async function() {
        await token.mintToGateway(tokenId)
        await token.setApprovalForAll(locker.address, true)
        await locker.lock(admin, tokenId)

        assert.strictEqual((await token.balanceOf(admin)).toString(), "0")
        assert.strictEqual(await token.ownerOf(tokenId), locker.address)
        assert.strictEqual(await locker.tokenIdToOwner(tokenId), admin)

        await locker.unlock(admin, 123)

        assert.strictEqual(await token.ownerOf(tokenId), admin)
        assert.strictEqual((await token.balanceOf(locker.address)).toString(), "0")
        assert.strictEqual(
          await locker.tokenIdToOwner(tokenId),
          "0x0000000000000000000000000000000000000000"
        )
      })
    })
  })
})
