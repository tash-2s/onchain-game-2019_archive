pragma solidity 0.5.13;

import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

contract AddressToBytes32NonOrderedArrayPermanence is WhitelistedRole {
  mapping(address => bytes32[]) private _addressToBytes32Array;

  function read(address addr) public view returns (bytes32[] memory) {
    return _addressToBytes32Array[addr];
  }

  function count(address addr) public view returns (uint256) {
    return _addressToBytes32Array[addr].length;
  }

  function update(address addr, bytes32[] memory b32Array) public onlyWhitelisted {
    _addressToBytes32Array[addr] = b32Array;
  }

  function readElement(address addr, uint256 index) public view returns (bytes32) {
    return _addressToBytes32Array[addr][index];
  }

  function updateElement(address addr, uint256 index, bytes32 b32) public onlyWhitelisted {
    _addressToBytes32Array[addr][index] = b32;
  }

  function createElement(address addr, bytes32 b32) public onlyWhitelisted returns (uint256) {
    return _addressToBytes32Array[addr].push(b32);
  }

  // This function change the order of the array.
  function deleteElement(address addr, uint256 index) public onlyWhitelisted {
    uint256 length = _addressToBytes32Array[addr].length;
    require(length > 0, "AddressToBytes32NonOrderedArrayPermanence: illegal delete");
    _addressToBytes32Array[addr][index] = _addressToBytes32Array[addr][length - 1];
    _addressToBytes32Array[addr].pop();
  }
}
