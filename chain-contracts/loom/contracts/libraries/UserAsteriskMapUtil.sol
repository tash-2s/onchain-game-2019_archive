pragma solidity 0.5.13;

library UserAsteriskMapUtil {
  function isInUsableRadius(int16 coordinateQ, int16 coordinateR, uint256 gold)
    internal
    pure
    returns (bool)
  {
    return _isInRadius(coordinateQ, coordinateR, _usableRadiusFromGold(gold));
  }

  function _usableRadiusFromGold(uint256 gold) private pure returns (uint8) {
    uint152[16] memory RADIUS_GOLD_THRESHOLD = [
      100001,
      10000000,
      10000000000,
      100000000000000,
      10000000000000000000,
      10000000000000000000000000,
      1000000000000000000000000000,
      100000000000000000000000000000,
      10000000000000000000000000000000,
      1000000000000000000000000000000000,
      100000000000000000000000000000000000,
      10000000000000000000000000000000000000,
      1000000000000000000000000000000000000000,
      100000000000000000000000000000000000000000,
      10000000000000000000000000000000000000000000,
      1000000000000000000000000000000000000000000000
    ];

    for (uint8 i = uint8(RADIUS_GOLD_THRESHOLD.length); i > 0; i--) {
      if (RADIUS_GOLD_THRESHOLD[i - 1] <= gold) {
        return i + 1;
      }
    }
    return 1;
  }

  function _isInRadius(int16 coordinateQ, int16 coordinateR, uint8 radius)
    private
    pure
    returns (bool)
  {
    return _distanceFromCenter(coordinateQ, coordinateR) <= radius;
  }

  function _distanceFromCenter(int16 coordinateQ, int16 coordinateR) private pure returns (uint16) {
    return uint16(_max(_abs(coordinateQ), _abs(coordinateR), _abs(-coordinateQ - coordinateR)));
  }

  function _max(uint256 a, uint256 b, uint256 c) private pure returns (uint256) {
    uint256 max = a;
    if (b > max) {
      max = b;
    }
    if (c > max) {
      max = c;
    }
    return max;
  }

  function _abs(int256 num) private pure returns (uint256) {
    if (num > 0) {
      return uint256(num);
    }
    if (num < 0) {
      return uint256(-num);
    }
    return 0; // num == 0
  }
}
