// usage: yarn truffle exec scripts/mingGold.js '0xTargetAddress' 123

const Gold = artifacts.require("./Gold.sol")

module.exports = async function(callback) {
  const address = process.argv[4]
  const amount = process.argv[5]

  const gold = await Gold.deployed()
  const result = await gold.mint(address, amount)
  console.log(result)

  const balance = await gold.balanceOf(address)
  console.log(`\nCurrent Balance: ${balance}\n`)

  callback()
}
