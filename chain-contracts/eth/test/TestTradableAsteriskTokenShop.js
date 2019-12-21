const {expectRevert, balance, BN} = require("@openzeppelin/test-helpers")

const TradableAsteriskTokenShop = artifacts.require("TradableAsteriskTokenShop")
const TradableAsteriskToken = artifacts.require("TradableAsteriskToken")
const TradableAsteriskTokenShortIdGenerator = artifacts.require(
  "TradableAsteriskTokenShortIdGenerator"
)

describe("TradableAsteriskTokenShop", function() {
  let admin, account
  let token, idGenerator, shop

  beforeEach(async function() {
    const accounts = await web3.eth.getAccounts()
    admin = accounts[0]
    account = accounts[1]

    token = await TradableAsteriskToken.new("0x0000000000000000000000000000000000000000")
    idGenerator = await TradableAsteriskTokenShortIdGenerator.new()
    shop = await TradableAsteriskTokenShop.new(token.address, idGenerator.address)

    await token.addWhitelisted(shop.address)
    await idGenerator.addWhitelisted(shop.address)
  })

  describe("#mint", function() {
    it("should revert when called with insufficient eth", async function() {
      await expectRevert(shop.mint(), "shop: insufficient eth")
    })

    it("should mint a asterisk when called with sufficient eth", async function() {
      const price = new BN("50000000000000000")

      assert.equal((await token.balanceOf(admin)).toString(), "0")
      const beforeBalance = await balance.current(admin)

      await shop.mint({value: price})

      assert.equal((await token.balanceOf(admin)).toString(), "1")
      const afterBalance = await balance.current(admin)
      assert.equal(afterBalance.lt(beforeBalance.sub(price)), true)
    })
  })

  describe("#withdrawSales", function() {
    const sales = "1000000000000000000"

    beforeEach(async function() {
      await shop.mint({value: sales})
    })

    it("should revert when called by a non whitelisted account", async function() {
      await expectRevert(
        shop.withdrawSales(),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    it("should withdraw sales when called by a whitelisted account", async function() {
      assert.equal((await balance.current(shop.address)).toString(), sales)
      await shop.addWhitelisted(admin)
      const beforeBalance = await balance.current(admin)

      await shop.withdrawSales()

      const afterBalance = await balance.current(admin)
      assert.equal(afterBalance.gt(beforeBalance), true)
      assert.equal((await balance.current(shop.address)).toString(), "0")
    })
  })
})
