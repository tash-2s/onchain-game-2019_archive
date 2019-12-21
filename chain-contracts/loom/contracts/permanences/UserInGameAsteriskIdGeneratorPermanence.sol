pragma solidity 0.5.13;

import "./abstracts/AddressToUint256Permanence.sol";

contract UserInGameAsteriskIdGeneratorPermanence is AddressToUint256Permanence {
  uint64 private constant _UINT64_MAX = ~uint64(0);

  function generate(address addr, uint64 num) public onlyWhitelisted returns (uint64[] memory) {
    uint256 _value = read(addr);
    require(_value <= _UINT64_MAX - num, "maximum id or invalid value");
    uint64 value = uint64(_value);

    update(addr, value + num);

    uint64[] memory arr = new uint64[](num);
    for (uint64 i = 0; i < num; i++) {
      arr[i] = value + 1 + i;
    }
    return arr;
  }
}
