const TestNFT = artifacts.require("./TestNFT.sol");

module.exports = function(deployer, network) {
  deployer.deploy(TestNFT);
};
