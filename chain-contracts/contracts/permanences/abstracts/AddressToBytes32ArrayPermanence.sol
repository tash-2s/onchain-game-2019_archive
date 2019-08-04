pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract AddressToBytes32ArrayPermanence is MinterRole {
  mapping(address => bytes32[]) private _addressToBytes32Array;

  function read(address addr) public view returns (bytes32[]) {
    return _addressToBytes32Array[addr];
  }

  function update(address addr, bytes32[] b32Array) public onlyMinter {
    _addressToBytes32Array[addr] = b32Array;
  }

  function pushElement(address addr, bytes32 b32) public onlyMinter {
    _addressToBytes32Array[addr].push(b32);
  }

  // TODO: rename
  function readByIndex(address addr, uint256 index) public view returns (bytes32) {
    return _addressToBytes32Array[addr][index];
  }

  // TODO: rename
  function updateByIndex(address addr, uint256 index, bytes32 b32) public onlyMinter {
    _addressToBytes32Array[addr][index] = b32;
  }

  // This function change the order of the array.
  function deleteElement(address addr, uint256 index) public onlyMinter {
    _addressToBytes32Array[addr][index] = _addressToBytes32Array[addr][_addressToBytes32Array[addr].length - 1];
    _addressToBytes32Array[addr].length--;
  }

  // TODO: test
  function deleteAll(address addr) public onlyMinter {
    _addressToBytes32Array[addr].length = 0;
  }

  function arrayLength(address addr) public view returns (uint256) {
    return _addressToBytes32Array[addr].length;
  }
}
