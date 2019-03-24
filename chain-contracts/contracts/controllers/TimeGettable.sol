pragma solidity 0.4.24;

contract TimeGettable {
  function uint32now() public view returns (uint32) {
    return uint32(block.timestamp);
  }
}
