pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract AbstractUint16ToUint256Permanence is MinterRole {
  mapping(uint16 => uint256) private _uint16ToUint256;

  function read(uint16 ui16) public view returns (uint256) {
    return _uint16ToUint256[ui16];
  }

  function update(uint16 ui16, uint256 ui256) public onlyMinter {
    _uint16ToUint256[ui16] = ui256;
  }
}
