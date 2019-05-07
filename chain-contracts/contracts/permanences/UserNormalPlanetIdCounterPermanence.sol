pragma solidity 0.4.24;

import "./abstracts/AddressToUint64Permanence.sol";

/* solium-disable no-empty-blocks */
// TODO: rename to Generator
contract UserNormalPlanetIdCounterPermanence is AddressToUint64Permanence {
  uint64 constant UINT64_MAX = ~uint64(0);

  function generate(address addr) public onlyMinter returns (uint64) {
    uint64 n = read(addr);

    require(n != UINT64_MAX, "maximum id");

    update(addr, n + 1);
    return n;
  }
}
