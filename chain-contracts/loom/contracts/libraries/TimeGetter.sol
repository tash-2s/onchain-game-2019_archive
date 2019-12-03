pragma solidity 0.5.11;

library TimeGetter {
  function uint32now() internal view returns (uint32) {
    return uint32(block.timestamp);
  }
}
