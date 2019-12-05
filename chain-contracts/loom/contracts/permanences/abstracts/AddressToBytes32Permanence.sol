pragma solidity 0.5.13;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract AddressToBytes32Permanence is MinterRole {
  mapping(address => bytes32) private _addressToBytes32;

  function read(address addr) public view returns (bytes32) {
    return _addressToBytes32[addr];
  }

  function update(address addr, bytes32 b32) public onlyMinter {
    _addressToBytes32[addr] = b32;
  }
}
