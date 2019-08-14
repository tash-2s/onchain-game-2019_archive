pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract Migrations is MinterRole {
  uint public last_completed_migration;

  function setCompleted(uint completed) public onlyMinter {
    last_completed_migration = completed;
  }

  function upgrade(address new_address) public onlyMinter {
    Migrations upgraded = Migrations(new_address);
    upgraded.setCompleted(last_completed_migration);
  }
}
