const helper = require("../migrationHelper")

const Gold = helper.buildContract(artifacts, "Gold", {
  abi: [
    {
      constant: false,
      inputs: [
        {
          name: "account",
          type: "address"
        }
      ],
      name: "addMinter",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
      signature: "0x983b2d56"
    },
    {
      constant: false,
      inputs: [],
      name: "renounceMinter",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
      signature: "0x98650275"
    },
    {
      constant: true,
      inputs: [
        {
          name: "account",
          type: "address"
        }
      ],
      name: "isMinter",
      outputs: [
        {
          name: "",
          type: "bool"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0xaa271e1a"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "account",
          type: "address"
        }
      ],
      name: "MinterAdded",
      type: "event",
      signature: "0x6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f6"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          name: "account",
          type: "address"
        }
      ],
      name: "MinterRemoved",
      type: "event",
      signature: "0xe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb66692"
    },
    {
      constant: true,
      inputs: [
        {
          name: "account",
          type: "address"
        }
      ],
      name: "userGold",
      outputs: [
        {
          name: "",
          type: "uint200"
        },
        {
          name: "",
          type: "uint40"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0x6664189c"
    },
    {
      constant: true,
      inputs: [
        {
          name: "account",
          type: "address"
        }
      ],
      name: "userGoldConfirmedAt",
      outputs: [
        {
          name: "",
          type: "uint40"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0xd3e15b6f"
    },
    {
      constant: true,
      inputs: [
        {
          name: "account",
          type: "address"
        }
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "",
          type: "uint200"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
      signature: "0x70a08231"
    },
    {
      constant: false,
      inputs: [
        {
          name: "account",
          type: "address"
        },
        {
          name: "quantity",
          type: "uint200"
        }
      ],
      name: "mint",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
      signature: "0xdd774eef"
    },
    {
      constant: false,
      inputs: [
        {
          name: "account",
          type: "address"
        },
        {
          name: "quantity",
          type: "uint200"
        }
      ],
      name: "unmint",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
      signature: "0x752caf6b"
    }
  ],
  bytecode:
    "0x608060405261001c33610021640100000000026401000000009004565b6101db565b61004281600061008864010000000002610d51179091906401000000009004565b8073ffffffffffffffffffffffffffffffffffffffff167f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f660405160405180910390a250565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141515156100c457600080fd5b6100dd8282610147640100000000026401000000009004565b1515156100e957600080fd5b60018260000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505050565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415151561018457600080fd5b8260000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b610edc806101ea6000396000f30060806040526004361061008e576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680636664189c1461009357806370a0823114610135578063752caf6b146101c2578063983b2d561461022a578063986502751461026d578063aa271e1a14610284578063d3e15b6f146102df578063dd774eef14610344575b600080fd5b34801561009f57600080fd5b506100d4600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506103ac565b604051808378ffffffffffffffffffffffffffffffffffffffffffffffffff1678ffffffffffffffffffffffffffffffffffffffffffffffffff1681526020018264ffffffffff1664ffffffffff1681526020019250505060405180910390f35b34801561014157600080fd5b50610176600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061043c565b604051808278ffffffffffffffffffffffffffffffffffffffffffffffffff1678ffffffffffffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101ce57600080fd5b50610228600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803578ffffffffffffffffffffffffffffffffffffffffffffffffff1690602001909291905050506104ad565b005b34801561023657600080fd5b5061026b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610707565b005b34801561027957600080fd5b50610282610727565b005b34801561029057600080fd5b506102c5600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610732565b604051808215151515815260200191505060405180910390f35b3480156102eb57600080fd5b50610320600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061074f565b604051808264ffffffffff1664ffffffffff16815260200191505060405180910390f35b34801561035057600080fd5b506103aa600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803578ffffffffffffffffffffffffffffffffffffffffffffffffff1690602001909291905050506107ac565b005b6000806000600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060000160009054906101000a900478ffffffffffffffffffffffffffffffffffffffffffffffffff168160000160199054906101000a900464ffffffffff169250925050915091565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160009054906101000a900478ffffffffffffffffffffffffffffffffffffffffffffffffff169050919050565b60006104b833610732565b15156104c357600080fd5b600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020905060408051908101604052806105818478ffffffffffffffffffffffffffffffffffffffffffffffffff168460000160009054906101000a900478ffffffffffffffffffffffffffffffffffffffffffffffffff1678ffffffffffffffffffffffffffffffffffffffffffffffffff16610be890919063ffffffff16565b78ffffffffffffffffffffffffffffffffffffffffffffffffff16815260200173__Util__________________________________63260348a06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b15801561060157600080fd5b505af4158015610615573d6000803e3d6000fd5b505050506040513d602081101561062b57600080fd5b810190808051906020019092919050505064ffffffffff16815250600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548178ffffffffffffffffffffffffffffffffffffffffffffffffff021916908378ffffffffffffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160196101000a81548164ffffffffff021916908364ffffffffff160217905550905050505050565b61071033610732565b151561071b57600080fd5b61072481610c09565b50565b61073033610c63565b565b6000610748826000610cbd90919063ffffffff16565b9050919050565b6000600160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160199054906101000a900464ffffffffff169050919050565b60006107b733610732565b15156107c257600080fd5b600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090508060000160009054906101000a900478ffffffffffffffffffffffffffffffffffffffffffffffffff1678ffffffffffffffffffffffffffffffffffffffffffffffffff16828260000160009054906101000a900478ffffffffffffffffffffffffffffffffffffffffffffffffff160178ffffffffffffffffffffffffffffffffffffffffffffffffff16101515610a53576040805190810160405280838360000160009054906101000a900478ffffffffffffffffffffffffffffffffffffffffffffffffff160178ffffffffffffffffffffffffffffffffffffffffffffffffff16815260200173__Util__________________________________63260348a06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b15801561094d57600080fd5b505af4158015610961573d6000803e3d6000fd5b505050506040513d602081101561097757600080fd5b810190808051906020019092919050505064ffffffffff16815250600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548178ffffffffffffffffffffffffffffffffffffffffffffffffff021916908378ffffffffffffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160196101000a81548164ffffffffff021916908364ffffffffff160217905550905050610be3565b604080519081016040528060001978ffffffffffffffffffffffffffffffffffffffffffffffffff16815260200173__Util__________________________________63260348a06040518163ffffffff167c010000000000000000000000000000000000000000000000000000000002815260040160206040518083038186803b158015610ae157600080fd5b505af4158015610af5573d6000803e3d6000fd5b505050506040513d6020811015610b0b57600080fd5b810190808051906020019092919050505064ffffffffff16815250600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548178ffffffffffffffffffffffffffffffffffffffffffffffffff021916908378ffffffffffffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160196101000a81548164ffffffffff021916908364ffffffffff1602179055509050505b505050565b600080838311151515610bfa57600080fd5b82840390508091505092915050565b610c1d816000610d5190919063ffffffff16565b8073ffffffffffffffffffffffffffffffffffffffff167f6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f660405160405180910390a250565b610c77816000610e0190919063ffffffff16565b8073ffffffffffffffffffffffffffffffffffffffff167fe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb6669260405160405180910390a250565b60008073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614151515610cfa57600080fd5b8260000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515610d8d57600080fd5b610d978282610cbd565b151515610da357600080fd5b60018260000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505050565b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614151515610e3d57600080fd5b610e478282610cbd565b1515610e5257600080fd5b60008260000160008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555050505600a165627a7a723058206d1b04b623b3c0df5a0b551eb499075d338a826da17079632b42297e3e270a8f0029"
})

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const utilAddress = await helper.getRegistryContractAddress(deployer.network_id, "Util")
    Gold.setNetwork(deployer.network_id)
    Gold.link("Util", utilAddress)
    await helper.deployAndRegister(deployer, network, Gold)
  })
}
