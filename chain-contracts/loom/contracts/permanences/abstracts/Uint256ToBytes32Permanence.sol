pragma solidity 0.5.13;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract Uint256ToBytes32Permanence is MinterRole {
  mapping(uint256 => bytes32) private _uint256ToBytes32;

  function read(uint256 ui256) public view returns (bytes32) {
    return _uint256ToBytes32[ui256];
  }

  function update(uint256 ui256, bytes32 b32) public onlyMinter {
    _uint256ToBytes32[ui256] = b32;
  }
}
