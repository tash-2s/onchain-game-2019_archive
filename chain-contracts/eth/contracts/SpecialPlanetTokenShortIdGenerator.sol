pragma solidity 0.5.13;

import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

contract SpecialPlanetTokenShortIdGenerator is WhitelistedRole {
  uint24 private constant _UINT24_MAX = ~uint24(0);

  uint24 public current;

  function next() external onlyWhitelisted returns (uint24) {
    require(current < _UINT24_MAX, "run out id");
    current++;
    return current;
  }
}
