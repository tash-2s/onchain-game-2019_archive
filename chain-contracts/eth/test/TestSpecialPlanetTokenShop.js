const {expectRevert, balance, BN} = require("@openzeppelin/test-helpers")

const SpecialPlanetTokenShop = artifacts.require("SpecialPlanetTokenShop")
const SpecialPlanetToken = artifacts.require("SpecialPlanetToken")
const SpecialPlanetTokenShortIdGenerator = artifacts.require("SpecialPlanetTokenShortIdGenerator")

describe("SpecialPlanetTokenShop", function() {
  beforeEach(async function() {
    const accounts = await web3.eth.getAccounts()
    this.deployer = accounts[0]
    this.stranger = accounts[1]

    this.token = await SpecialPlanetToken.new("0x0000000000000000000000000000000000000000")
    this.idGenerator = await SpecialPlanetTokenShortIdGenerator.new()
    this.shop = await SpecialPlanetTokenShop.new(this.token.address, this.idGenerator.address)
    await this.token.addWhitelisted(this.shop.address)
    await this.idGenerator.addWhitelisted(this.shop.address)
  })

  describe("#mint", function() {
    it("should revert when called with insufficient eth", async function() {
      await expectRevert(this.shop.mint(), "shop: insufficient eth")
    })

    it("should mint a planet when called with sufficient eth", async function() {
      const price = new BN("100000000000000000")

      assert.equal((await this.token.balanceOf(this.deployer)).toString(), "0")
      const beforeBalance = await balance.current(this.deployer)

      await this.shop.mint({value: price})

      assert.equal((await this.token.balanceOf(this.deployer)).toString(), "1")
      const afterBalance = await balance.current(this.deployer)
      assert.equal(afterBalance.lt(beforeBalance.sub(price)), true)
    })
  })

  describe("#withdrawSales", function() {
    const sales = "1000000000000000000"

    beforeEach(async function() {
      await this.shop.mint({value: sales})
    })

    it("should revert when called by a non whitelisted account", async function() {
      await expectRevert(
        this.shop.withdrawSales(),
        "WhitelistedRole: caller does not have the Whitelisted role"
      )
    })

    it("should withdraw sales when called by a whitelisted account", async function() {
      assert.equal((await balance.current(this.shop.address)).toString(), sales)
      await this.shop.addWhitelisted(this.deployer)
      const beforeBalance = await balance.current(this.deployer)

      await this.shop.withdrawSales()

      const afterBalance = await balance.current(this.deployer)
      assert.equal(afterBalance.gt(beforeBalance), true)
      assert.equal((await balance.current(this.shop.address)).toString(), "0")
    })
  })
})
