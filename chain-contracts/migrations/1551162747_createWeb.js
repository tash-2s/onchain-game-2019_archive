const helper = require("../migrationHelper")

const Web = helper.buildContract(artifacts, "Web", {
  abi: [
    {
      constant: true,
      inputs: [],
      name: "userNormalPlanet",
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
      name: "gold",
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
      inputs: [
        {
          name: "userNormalPlanetContractAddress",
          type: "address"
        },
        {
          name: "goldContractAddress",
          type: "address"
        }
      ],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor"
    },
    {
      constant: true,
      inputs: [
        {
          name: "account",
          type: "address"
        }
      ],
      name: "getUser",
      outputs: [
        {
          name: "confirmedGold",
          type: "uint200"
        },
        {
          name: "goldConfirmedAt",
          type: "uint40"
        },
        {
          name: "unpIds",
          type: "uint16[]"
        },
        {
          name: "unpRanks",
          type: "uint8[]"
        },
        {
          name: "unpTimes",
          type: "uint40[]"
        },
        {
          name: "unpAxialCoordinates",
          type: "int16[]"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    }
  ],
  bytecode:
    "0x608060405234801561001057600080fd5b506040516040806110078339810180604052810190808051906020019092919080519060200190929190505050816000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555080600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505050610f38806100cf6000396000f300608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680636f77926b1461005c5780638720afd01461021e578063fbec6f2114610275575b600080fd5b34801561006857600080fd5b5061009d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506102cc565b604051808778ffffffffffffffffffffffffffffffffffffffffffffffffff1678ffffffffffffffffffffffffffffffffffffffffffffffffff1681526020018664ffffffffff1664ffffffffff16815260200180602001806020018060200180602001858103855289818151815260200191508051906020019060200280838360005b8381101561013c578082015181840152602081019050610121565b50505050905001858103845288818151815260200191508051906020019060200280838360005b8381101561017e578082015181840152602081019050610163565b50505050905001858103835287818151815260200191508051906020019060200280838360005b838110156101c05780820151818401526020810190506101a5565b50505050905001858103825286818151815260200191508051906020019060200280838360005b838110156102025780820151818401526020810190506101e7565b505050509050019a505050505050505050505060405180910390f35b34801561022a57600080fd5b50610233610ec1565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561028157600080fd5b5061028a610ee6565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60008060608060608060606000806000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16636664189c8c6040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019150506040805180830381600087803b15801561039857600080fd5b505af11580156103ac573d6000803e3d6000fd5b505050506040513d60408110156103c257600080fd5b810190808051906020019092919080519060200190929190505050809a50819b5050506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166379e1a00c8c6040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001915050600060405180830381600087803b1580156104a157600080fd5b505af11580156104b5573d6000803e3d6000fd5b505050506040513d6000823e3d601f19601f8201168201806040525060208110156104df57600080fd5b8101908080516401000000008111156104f757600080fd5b8281019050602081018481111561050d57600080fd5b815185602082028301116401000000008211171561052a57600080fd5b5050929190505050935073__UserNormalPlanetArrayReader___________632709b0ac856040518263ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001828103825283818151815260200191508051906020019060200280838360005b838110156105bd5780820151818401526020810190506105a2565b505050509050019250505060206040518083038186803b1580156105e057600080fd5b505af41580156105f4573d6000803e3d6000fd5b505050506040513d602081101561060a57600080fd5b810190808051906020019092919050505092506002830260405190808252806020026020018201604052801561064f5781602001602082028038833980820191505090505b509750826040519080825280602002602001820160405280156106815781602001602082028038833980820191505090505b509650600283026040519080825280602002602001820160405280156106b65781602001602082028038833980820191505090505b509550600283026040519080825280602002602001820160405280156106eb5781602001602082028038833980820191505090505b50945060009150600090505b82811015610eb45773__UserNormalPlanetArrayReader___________63600a2bed85836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001838152602001828103825284818151815260200191508051906020019060200280838360005b8381101561078f578082015181840152602081019050610774565b50505050905001935050505060206040518083038186803b1580156107b357600080fd5b505af41580156107c7573d6000803e3d6000fd5b505050506040513d60208110156107dd57600080fd5b810190808051906020019092919050505088838151811015156107fc57fe5b9060200190602002019061ffff16908161ffff168152505073__UserNormalPlanetArrayReader___________63df01ce7285836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001838152602001828103825284818151815260200191508051906020019060200280838360005b838110156108a4578082015181840152602081019050610889565b50505050905001935050505060206040518083038186803b1580156108c857600080fd5b505af41580156108dc573d6000803e3d6000fd5b505050506040513d60208110156108f257600080fd5b8101908080519060200190929190505050886001840181518110151561091457fe5b9060200190602002019061ffff16908161ffff168152505073__UserNormalPlanetArrayReader___________63dfca7e2085836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001838152602001828103825284818151815260200191508051906020019060200280838360005b838110156109bc5780820151818401526020810190506109a1565b50505050905001935050505060206040518083038186803b1580156109e057600080fd5b505af41580156109f4573d6000803e3d6000fd5b505050506040513d6020811015610a0a57600080fd5b81019080805190602001909291905050508782815181101515610a2957fe5b9060200190602002019060ff16908160ff168152505073__UserNormalPlanetArrayReader___________63f652a83785836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001838152602001828103825284818151815260200191508051906020019060200280838360005b83811015610acf578082015181840152602081019050610ab4565b50505050905001935050505060206040518083038186803b158015610af357600080fd5b505af4158015610b07573d6000803e3d6000fd5b505050506040513d6020811015610b1d57600080fd5b81019080805190602001909291905050508683815181101515610b3c57fe5b9060200190602002019064ffffffffff16908164ffffffffff168152505073__UserNormalPlanetArrayReader___________635781f2c185836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001838152602001828103825284818151815260200191508051906020019060200280838360005b83811015610bea578082015181840152602081019050610bcf565b50505050905001935050505060206040518083038186803b158015610c0e57600080fd5b505af4158015610c22573d6000803e3d6000fd5b505050506040513d6020811015610c3857600080fd5b81019080805190602001909291905050508660018401815181101515610c5a57fe5b9060200190602002019064ffffffffff16908164ffffffffff168152505073__UserNormalPlanetArrayReader___________63a1b4c7ab85836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001838152602001828103825284818151815260200191508051906020019060200280838360005b83811015610d08578082015181840152602081019050610ced565b50505050905001935050505060206040518083038186803b158015610d2c57600080fd5b505af4158015610d40573d6000803e3d6000fd5b505050506040513d6020811015610d5657600080fd5b81019080805190602001909291905050508583815181101515610d7557fe5b9060200190602002019060010b908160010b8152505073__UserNormalPlanetArrayReader___________634f266d8085836040518363ffffffff167c01000000000000000000000000000000000000000000000000000000000281526004018080602001838152602001828103825284818151815260200191508051906020019060200280838360005b83811015610e1b578082015181840152602081019050610e00565b50505050905001935050505060206040518083038186803b158015610e3f57600080fd5b505af4158015610e53573d6000803e3d6000fd5b505050506040513d6020811015610e6957600080fd5b81019080805190602001909291905050508560018401815181101515610e8b57fe5b9060200190602002019060010b908160010b8152505060028201915080806001019150506106f7565b5050505091939550919395565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16815600a165627a7a723058208b0135260cd399467d1056dc23843911d10866fb2037b954ba23535d04756d390029"
})

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const readerAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanetArrayReader"
    )
    Web.setNetwork(deployer.network_id)
    Web.link("UserNormalPlanetArrayReader", readerAddress)

    const userNormalPlanetAddress = await helper.getRegistryContractAddress(
      deployer.network_id,
      "UserNormalPlanet"
    )
    const goldAddress = await helper.getRegistryContractAddress(deployer.network_id, "Gold")
    await helper.deployAndRegister(deployer, network, Web, [userNormalPlanetAddress, goldAddress])
  })
}
