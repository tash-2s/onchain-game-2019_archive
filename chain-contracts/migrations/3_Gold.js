const Gold = artifacts.require("./Gold.sol");

module.exports = function(deployer, network) {
  deployer.deploy(Gold);
};
