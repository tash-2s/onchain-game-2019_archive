const helper = require("../migrationHelper")

const UserNormalPlanetArrayReader = helper.buildContract(artifacts, "UserNormalPlanetArrayReader", {
  abi: [
    {
      constant: true,
      inputs: [],
      name: "userPlanetFieldCount",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "userPlanetIdIndex",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "userPlanetNormalIdIndex",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "userPlanetKindIndex",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "userPlanetOriginalParamIndex",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "userPlanetRankIndex",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "userPlanetRankupedAtIndex",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "userPlanetCreatedAtIndex",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "userPlanetAxialCoordinateQIndex",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "userPlanetAxialCoordinateRIndex",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "fields",
      outputs: [
        {
          name: "",
          type: "int48[]"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "id",
      outputs: [
        {
          name: "",
          type: "uint16"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "normalPlanetId",
      outputs: [
        {
          name: "",
          type: "uint16"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "originalParam",
      outputs: [
        {
          name: "",
          type: "uint16"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "kind",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "rank",
      outputs: [
        {
          name: "",
          type: "uint8"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "rankupedAt",
      outputs: [
        {
          name: "",
          type: "uint40"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "createdAt",
      outputs: [
        {
          name: "",
          type: "uint40"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "axialCoordinateQ",
      outputs: [
        {
          name: "",
          type: "int16"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "axialCoordinateR",
      outputs: [
        {
          name: "",
          type: "int16"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "rate",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "ratedParam",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        },
        {
          name: "userPlanetIndex",
          type: "uint256"
        }
      ],
      name: "requiredSecForRankup",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        {
          name: "userPlanets",
          type: "int48[]"
        }
      ],
      name: "userPlanetsCount",
      outputs: [
        {
          name: "",
          type: "uint256"
        }
      ],
      payable: false,
      stateMutability: "pure",
      type: "function"
    }
  ],
  bytecode:
    "0x610d8f610030600b82828239805160001a6073146000811461002057610022565bfe5b5030600052607381538281f3007300000000000000000000000000000000000000003014608060405260043610610154576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168062b7cc7e146101595780632709b0ac146101d65780632ae812f1146102435780633548a43f146102ba5780634375cfda146102de5780634a701074146103025780634c69cf6f146103265780634f266d801461034a5780635781f2c1146103c757806357a8cd581461044c578063600a2bed146104705780636cb65aa5146104ef5780637899cdfc14610513578063a1b4c7ab146105cb578063a4e2f43714610648578063b42ce4dd1461066c578063be1e948b146106eb578063c5e623fe1461070f578063d72749a414610733578063df01ce7214610757578063dfca7e20146107d6578063edbc512414610853578063f2109120146108ca578063f652a83714610941575b600080fd5b6101ba60048036038101908080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509192919290803590602001909291905050506109c6565b604051808260ff1660ff16815260200191505060405180910390f35b61022d600480360381019080803590602001908201803590602001908080602002602001604051908101604052809392919081815260200183836020028082843782019150505050505091929192905050506109f4565b6040518082815260200191505060405180910390f35b6102a46004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610a95565b6040518082815260200191505060405180910390f35b6102c2610ab2565b604051808260ff1660ff16815260200191505060405180910390f35b6102e6610abb565b604051808260ff1660ff16815260200191505060405180910390f35b61030a610ac4565b604051808260ff1660ff16815260200191505060405180910390f35b61032e610acd565b604051808260ff1660ff16815260200191505060405180910390f35b6103ab6004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610ad6565b604051808260010b60010b815260200191505060405180910390f35b6104286004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610b04565b604051808264ffffffffff1664ffffffffff16815260200191505060405180910390f35b610454610b32565b604051808260ff1660ff16815260200191505060405180910390f35b6104d16004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610b3b565b604051808261ffff1661ffff16815260200191505060405180910390f35b6104f7610b69565b604051808260ff1660ff16815260200191505060405180910390f35b6105746004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610b72565b6040518080602001828103825283818151815260200191508051906020019060200280838360005b838110156105b757808201518184015260208101905061059c565b505050509050019250505060405180910390f35b61062c6004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610c1f565b604051808260010b60010b815260200191505060405180910390f35b610650610c4d565b604051808260ff1660ff16815260200191505060405180910390f35b6106cd6004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610c56565b604051808261ffff1661ffff16815260200191505060405180910390f35b6106f3610c84565b604051808260ff1660ff16815260200191505060405180910390f35b610717610c8d565b604051808260ff1660ff16815260200191505060405180910390f35b61073b610c96565b604051808260ff1660ff16815260200191505060405180910390f35b6107b86004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610c9e565b604051808261ffff1661ffff16815260200191505060405180910390f35b6108376004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610ccc565b604051808260ff1660ff16815260200191505060405180910390f35b6108b46004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610cfa565b6040518082815260200191505060405180910390f35b61092b6004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610d12565b6040518082815260200191505060405180910390f35b6109a26004803603810190808035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919291929080359060200190929190505050610d35565b604051808264ffffffffff1664ffffffffff16815260200191505060405180910390f35b600082600260ff16600960ff168402018151811015156109e257fe5b90602001906020020151905092915050565b600080600960ff168351811515610a0757fe5b06141515610a7d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260128152602001807f62726f6b656e2075736572506c616e657473000000000000000000000000000081525060200191505060405180910390fd5b600960ff168251811515610a8d57fe5b049050919050565b60006001610aa38484610ccc565b60ff160360020a905092915050565b60006001905090565b60006006905090565b60006009905090565b60006007905090565b600082600860ff16600960ff16840201815181101515610af257fe5b90602001906020020151905092915050565b600082600660ff16600960ff16840201815181101515610b2057fe5b90602001906020020151905092915050565b60006004905090565b600082600060ff16600960ff16840201815181101515610b5757fe5b90602001906020020151905092915050565b60006005905090565b606080600080600960ff16604051908082528060200260200182016040528015610bab5781602001602082028038833980820191505090505b509250600960ff1685029150600090505b600960ff16811015610c135785818301815181101515610bd857fe5b906020019060200201518382815181101515610bf057fe5b9060200190602002019060050b908160050b815250508080600101915050610bbc565b82935050505092915050565b600082600760ff16600960ff16840201815181101515610c3b57fe5b90602001906020020151905092915050565b60006003905090565b600082600360ff16600960ff16840201815181101515610c7257fe5b90602001906020020151905092915050565b60006008905090565b60006002905090565b600080905090565b600082600160ff16600960ff16840201815181101515610cba57fe5b90602001906020020151905092915050565b600082600460ff16600960ff16840201815181101515610ce857fe5b90602001906020020151905092915050565b6000610d068383610a95565b61025802905092915050565b6000610d1e8383610a95565b610d288484610c56565b61ffff1602905092915050565b600082600560ff16600960ff16840201815181101515610d5157fe5b906020019060200201519050929150505600a165627a7a72305820b186558c116874c8167afe5539a3319902076fbd2a67e4bac4e018b41812868f0029"
})

module.exports = function(deployer, network) {
  deployer.then(async function() {
    const reader = await deployer.deploy(UserNormalPlanetArrayReader)
    helper.registerInstance(network, reader)
  })
}
