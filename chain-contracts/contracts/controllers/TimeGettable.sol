pragma solidity 0.4.24;

contract TimeGettable {
  function uint40now() public view returns (uint40) {
    return uint40(block.timestamp);
  }
}
