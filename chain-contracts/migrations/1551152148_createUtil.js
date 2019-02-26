const helper = require("../migrationHelper")

const Util = helper.buildContract(artifacts, "Util", {
  abi: [
    {
      constant: true,
      inputs: [],
      name: "uint40now",
      outputs: [
        {
          name: "",
          type: "uint40"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0x260348a0"
    }
  ],
  bytecode:
    "0x60b961002f600b82828239805160001a6073146000811461001f57610021565bfe5b5030600052607381538281f30073000000000000000000000000000000000000000030146080604052600436106056576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063260348a014605b575b600080fd5b60616085565b604051808264ffffffffff1664ffffffffff16815260200191505060405180910390f35b6000429050905600a165627a7a723058201cc994a38f5f2887dd2c560bee25bcefe5f5286699f707ed3fec79073bbd5afb0029"
})

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const util = await deployer.deploy(Util)
    helper.registerInstance(network, util)
  })
}
