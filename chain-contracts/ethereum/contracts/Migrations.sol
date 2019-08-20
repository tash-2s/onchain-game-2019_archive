pragma solidity 0.5.11;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract Migrations is MinterRole {
  uint256 public last_completed_migration;

  function setCompleted(uint256 completed) public onlyMinter {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public onlyMinter {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
