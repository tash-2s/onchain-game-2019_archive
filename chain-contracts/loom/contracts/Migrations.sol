pragma solidity 0.5.13;

import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

contract Migrations is WhitelistedRole {
  uint256 public last_completed_migration;

  function setCompleted(uint256 completed) external onlyWhitelisted {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) external onlyWhitelisted {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
