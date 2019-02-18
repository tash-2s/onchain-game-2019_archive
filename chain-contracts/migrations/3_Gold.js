const Gold = artifacts.require("./Gold.sol")
const UtilLib = artifacts.require("./lib/Util.sol")

module.exports = function(deployer, network) {
  deployer.deploy(UtilLib)
  deployer.link(UtilLib, Gold)
  deployer.deploy(Gold)
}
