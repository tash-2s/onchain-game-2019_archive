pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract AbstractAddressToUint16Permanence is MinterRole {
  mapping(address => uint16) private _addressToUint16;

  function read(address addr) public view returns (uint16) {
    return _addressToUint16[addr];
  }

  function update(address addr, uint16 ui16) public onlyMinter {
    _addressToUint16[addr] = ui16;
  }
}
