pragma solidity 0.5.13;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract Migrations is MinterRole {
  uint256 public last_completed_migration;

  function setCompleted(uint256 completed) external onlyMinter {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) external onlyMinter {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
