const fs = require("fs")

const Gold = artifacts.require("./Gold.sol")

module.exports = function(deployer, network) {
  const utilAddress = JSON.parse(fs.readFileSync(`./networks/${network}/Util`))

  deployer.link(utilAddress, Gold)
  deployer.deploy(Gold)
}
