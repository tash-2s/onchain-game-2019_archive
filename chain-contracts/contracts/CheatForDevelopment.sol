pragma solidity 0.4.24;

import "./Gold.sol";

// TODO: Make impossible to use this outside development environments
contract CheatForDevelopment {
  Gold public gold;

  constructor(address goldContractAddress) public {
    gold = Gold(goldContractAddress);
  }

  function mintGold(address to, uint256 value) public {
    gold.mint(to, value);
  }
}
