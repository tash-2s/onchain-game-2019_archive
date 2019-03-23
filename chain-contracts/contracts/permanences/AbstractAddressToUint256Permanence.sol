pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract AbstractAddressToUint256Permanence is MinterRole {
  mapping(address => uint256) private _addressToUint256;

  function read(address addr) public view returns (uint256) {
    return _addressToUint256[addr];
  }

  function update(address addr, uint256 ui256) public onlyMinter {
    _addressToUint256[addr] = ui256;
  }
}
