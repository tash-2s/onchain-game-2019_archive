const Migrations = artifacts.require("Migrations")

module.exports = function(deployer, network, accounts) {
  deployer.then(async function() {
    const migrations = await deployer.deploy(Migrations)
    await migrations.addWhitelisted(accounts[0])
  })
}
