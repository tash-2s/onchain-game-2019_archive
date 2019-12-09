pragma solidity 0.5.13;

library MyMath {
  function pow(uint256 base, uint256 exponent) internal pure returns (uint256) {
    // 15**64 < 2**256 - 1
    require(base <= 15 && exponent <= 64, "possible overflow");
    return base**exponent;
  }
}
