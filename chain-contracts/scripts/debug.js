// Execute DebugController's functions
//
// usage: yarn truffle exec scripts/debug.js --network [networkName] [functionName] [args...]
// example: yarn truffle exec scripts/debug.js --network loom_local debugMintGold "0xbF11e74f927A1897a265a0bdB204b61570D18c20" 123

const DebugController = artifacts.require("./controllers/DebugController")

module.exports = async function(callback) {
  let [_0, _1, _2, _3, _4, _5, functionName, ...functionArgs] = process.argv
  console.log(functionName, functionArgs)

  const controller = await DebugController.deployed()
  const result = await controller[functionName](...functionArgs)
  console.log(result)

  callback()
}
