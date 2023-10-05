pragma solidity 0.5.13;

import "truffle/Assert.sol";

contract Test {
  function testHash() public {
    uint256 max = ~uint256(0);

    bytes32 a = keccak256(abi.encodePacked(max, max));
    bytes32 b = keccak256(abi.encodePacked(max, max, max));

    Assert.isFalse(a == b, "hash");
  }
}
