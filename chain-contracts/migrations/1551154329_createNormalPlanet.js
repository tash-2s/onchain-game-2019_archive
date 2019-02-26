const helper = require("../migrationHelper")

const NormalPlanet = helper.buildContract(artifacts, "NormalPlanet", {
  abi: [
    {
      constant: false,
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
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
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "isOwner",
      outputs: [
        {
          name: "",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "newOwner",
          type: "address"
        }
      ],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "previousOwner",
          type: "address"
        },
        {
          indexed: true,
          name: "newOwner",
          type: "address"
        }
      ],
      name: "OwnershipTransferred",
      type: "event"
    },
    {
      constant: true,
      inputs: [
        {
          name: "id",
          type: "uint16"
        }
      ],
      name: "isPlanet",
      outputs: [
        {
          name: "",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "id",
          type: "uint16"
        }
      ],
      name: "planet",
      outputs: [
        {
          name: "",
          type: "uint8"
        },
        {
          name: "",
          type: "uint16"
        },
        {
          name: "",
          type: "uint200"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        {
          name: "id",
          type: "uint16"
        },
        {
          name: "kind",
          type: "uint8"
        },
        {
          name: "param",
          type: "uint16"
        },
        {
          name: "priceGold",
          type: "uint200"
        }
      ],
      name: "create",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    }
  ],
  bytecode:
    "0x6080604052336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3610862806100cf6000396000f300608060405260043610610083576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063715018a6146100885780638da5cb5b1461009f5780638f32d59b146100f6578063903b0ca014610125578063b45906f614610196578063ef07e91a146101df578063f2fde38b14610276575b600080fd5b34801561009457600080fd5b5061009d6102b9565b005b3480156100ab57600080fd5b506100b461038b565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561010257600080fd5b5061010b6103b4565b604051808215151515815260200191505060405180910390f35b34801561013157600080fd5b50610194600480360381019080803561ffff169060200190929190803560ff169060200190929190803561ffff169060200190929190803578ffffffffffffffffffffffffffffffffffffffffffffffffff16906020019092919050505061040b565b005b3480156101a257600080fd5b506101c5600480360381019080803561ffff1690602001909291905050506105bc565b604051808215151515815260200191505060405180910390f35b3480156101eb57600080fd5b5061020e600480360381019080803561ffff1690602001909291905050506105f1565b604051808460ff1660ff1681526020018361ffff1661ffff1681526020018278ffffffffffffffffffffffffffffffffffffffffffffffffff1678ffffffffffffffffffffffffffffffffffffffffffffffffff168152602001935050505060405180910390f35b34801561028257600080fd5b506102b7600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061071d565b005b6102c16103b4565b15156102cc57600080fd5b600073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a360008060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905090565b6104136103b4565b151561041e57600080fd5b610427846105bc565b15151561049c576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f696420697320616c72656164792075736564000000000000000000000000000081525060200191505060405180910390fd5b6080604051908101604052808460ff1681526020018361ffff1681526020018278ffffffffffffffffffffffffffffffffffffffffffffffffff16815260200160011515815250600160008661ffff1661ffff16815260200190815260200160002060008201518160000160006101000a81548160ff021916908360ff16021790555060208201518160000160016101000a81548161ffff021916908361ffff16021790555060408201518160000160036101000a81548178ffffffffffffffffffffffffffffffffffffffffffffffffff021916908378ffffffffffffffffffffffffffffffffffffffffffffffffff160217905550606082015181600001601c6101000a81548160ff02191690831515021790555090505050505050565b6000600160008361ffff1661ffff168152602001908152602001600020600001601c9054906101000a900460ff169050919050565b60008060006105ff846105bc565b1515610673576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260138152602001807f706c616e6574206973206e6f7420666f756e640000000000000000000000000081525060200191505060405180910390fd5b600160008561ffff1661ffff16815260200190815260200160002060000160009054906101000a900460ff16600160008661ffff1661ffff16815260200190815260200160002060000160019054906101000a900461ffff16600160008761ffff1661ffff16815260200190815260200160002060000160039054906101000a900478ffffffffffffffffffffffffffffffffffffffffffffffffff169250925092509193909250565b6107256103b4565b151561073057600080fd5b6107398161073c565b50565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415151561077857600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505600a165627a7a72305820e0162e4fc2e19ac9d5ff20da59f481638ac39427806db4f0ad493e82652cd9f60029"
})

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const normalPlanet = await helper.deployAndRegister(deployer, network, NormalPlanet)

    await normalPlanet.create(1, 1, 10, 5)
    await normalPlanet.create(2, 2, 10, 5)
  })
}
