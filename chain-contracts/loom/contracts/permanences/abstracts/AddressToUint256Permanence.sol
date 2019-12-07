pragma solidity 0.5.13;

import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

contract AddressToUint256Permanence is WhitelistedRole {
  mapping(address => uint256) private _addressToUint256;

  function read(address addr) public view returns (uint256) {
    return _addressToUint256[addr];
  }

  function update(address addr, uint256 ui256) public onlyWhitelisted {
    _addressToUint256[addr] = ui256;
  }
}
