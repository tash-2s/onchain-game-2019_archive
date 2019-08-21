pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract SpecialPlanetShortIdGenerator is MinterRole {
  uint24 constant UINT24_MAX = ~uint24(0);

  uint24 public current;

  function next() public onlyMinter returns (uint24) {
    require(current < UINT24_MAX, "run out id");
    current++;
    return current;
  }
}
