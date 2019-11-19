pragma solidity 0.5.11;

import "./abstracts/AddressToUint64Permanence.sol";

contract UserNormalPlanetIdGeneratorPermanence is AddressToUint64Permanence {
  uint64 constant UINT64_MAX = ~uint64(0);

  function generate(address addr, uint64 num) public onlyMinter returns (uint64[] memory) {
    uint64 value = read(addr);
    require(value <= UINT64_MAX - num, "maximum id");
    update(addr, value + num);

    uint64[] memory arr = new uint64[](num);
    for (uint64 i = 0; i < num; i++) {
      arr[i] = value + 1 + i;
    }
    return arr;
  }
}
