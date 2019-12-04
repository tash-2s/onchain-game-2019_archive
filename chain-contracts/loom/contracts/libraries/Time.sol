pragma solidity 0.5.11;

library Time {
  function uint32now() internal view returns (uint32) {
    return uint32(block.timestamp);
  }
}
