pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract AddressToUint64Permanence is MinterRole {
  mapping(address => uint64) private _addressToUint64;

  function read(address addr) public view returns (uint64) {
    return _addressToUint64[addr];
  }

  function update(address addr, uint64 ui64) public onlyMinter {
    _addressToUint64[addr] = ui64;
  }
}
