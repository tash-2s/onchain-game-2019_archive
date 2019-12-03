pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract SpecialPlanetTokenShortIdGenerator is MinterRole {
  uint24 private constant _UINT24_MAX = ~uint24(0);

  uint24 public current;

  function next() external onlyMinter returns (uint24) {
    require(current < _UINT24_MAX, "run out id");
    current++;
    return current;
  }
}
