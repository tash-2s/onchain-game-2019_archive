const {expectRevert, constants} = require("@openzeppelin/test-helpers")

const TradableAsteriskToken = artifacts.require("TradableAsteriskToken")

describe("TradableAsteriskToken", function() {
  let admin, account, token

  beforeEach(async function() {
    const accounts = await web3.eth.getAccounts()
    admin = accounts[0]
    account = accounts[1]

    token = await TradableAsteriskToken.new(admin)
  })

  describe("#mintToGateway", function() {
    it("should revert when called by a non gateway account", async function() {
      await expectRevert(
        token.mintToGateway(1, {from: account}),
        "TradableAsteriskToken: only the gateway is allowed to mint"
      )
    })

    it("should mint a asterisk when called by a gateway account", async function() {
      assert.equal((await token.balanceOf(admin)).toString(), "0")

      await token.mintToGateway(1, {from: admin})

      assert.equal((await token.balanceOf(admin)).toString(), "1")
    })
  })
})
