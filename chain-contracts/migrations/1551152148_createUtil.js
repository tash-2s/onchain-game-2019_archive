const fs = require("fs")

const Util = artifacts.require("./lib/Util.sol")

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const util = await deployer.deploy(Util)
    fs.writeFileSync(`./networks/${network}/Util`, util.address)
  })
};
