pragma solidity 0.5.11;

contract TimeGettable {
  function uint32now() public view returns (uint32) {
    return uint32(block.timestamp);
  }
}
