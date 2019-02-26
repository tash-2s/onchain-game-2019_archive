const helper = require("../migrationHelper")

const Migrations = helper.buildContract(artifacts, "Migrations", {
  abi: [
    {
      constant: true,
      inputs: [],
      name: "last_completed_migration",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0x445df0ac"
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [
        {
          name: "",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0x8da5cb5b"
    },
    {
      inputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor",
      signature: "constructor"
    },
    {
      constant: false,
      inputs: [
        {
          name: "completed",
          type: "uint256"
        }
      ],
      name: "setCompleted",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
      signature: "0xfdacd576"
    },
    {
      constant: false,
      inputs: [
        {
          name: "new_address",
          type: "address"
        }
      ],
      name: "upgrade",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
      signature: "0x0900f010"
    }
  ],
  bytecode:
    "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506102f8806100606000396000f300608060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630900f01014610067578063445df0ac146100aa5780638da5cb5b146100d5578063fdacd5761461012c575b600080fd5b34801561007357600080fd5b506100a8600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610159565b005b3480156100b657600080fd5b506100bf610241565b6040518082815260200191505060405180910390f35b3480156100e157600080fd5b506100ea610247565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561013857600080fd5b506101576004803603810190808035906020019092919050505061026c565b005b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561023d578190508073ffffffffffffffffffffffffffffffffffffffff1663fdacd5766001546040518263ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040180828152602001915050600060405180830381600087803b15801561022457600080fd5b505af1158015610238573d6000803e3d6000fd5b505050505b5050565b60015481565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156102c957806001819055505b505600a165627a7a72305820077bc2d2ce3e5214ea01ec9d332ba070d56b49a8f63f6e42cf0599daf6b0c4d70029"
})

module.exports = function(deployer, network) {
  deployer.deploy(Migrations).then(migrations => {
    return helper.registerInstance(network, migrations)
  })
}
