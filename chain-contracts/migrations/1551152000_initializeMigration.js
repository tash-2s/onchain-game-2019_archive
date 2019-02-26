const fs = require("fs")

const Migrations = artifacts.require("./Migrations.sol")

module.exports = function(deployer, network) {
  fs.rmdirSync(`./networks/${network}`)
  fs.mkdirSync(`./networks/${network}`)
  deployer.deploy(Migrations)
}
