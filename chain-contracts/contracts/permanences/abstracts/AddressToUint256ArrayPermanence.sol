pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract AddressToUint256ArrayPermanence is MinterRole {
  mapping(address => uint256[]) private _addressToUint256Array;

  function read(address addr) public view returns (uint256[]) {
    return _addressToUint256Array[addr];
  }

  function update(address addr, uint256[] ui256Array) public onlyMinter {
    _addressToUint256Array[addr] = ui256Array;
  }

  function pushElement(address addr, uint256 ui256) public onlyMinter {
    _addressToUint256Array[addr].push(ui256);
  }

  // TODO: rename
  function readByIndex(address addr, uint256 index) public view returns (uint256) {
    return _addressToUint256Array[addr][index];
  }

  // TODO: rename
  function updateByIndex(address addr, uint256 index, uint256 ui256) public onlyMinter {
    _addressToUint256Array[addr][index] = ui256;
  }

  // TODO: test
  // This function change the order of the array.
  function deleteElement(address addr, uint256 index) public onlyMinter {
    _addressToUint256Array[addr][index] = _addressToUint256Array[addr][_addressToUint256Array[addr].length - 1];
    _addressToUint256Array[addr].length--;
  }

  // TODO: test
  function deleteAll(address addr) public onlyMinter {
    _addressToUint256Array[addr].length = 0;
  }

  function arrayLength(address addr) public view returns (uint256) {
    return _addressToUint256Array[addr].length;
  }
}
