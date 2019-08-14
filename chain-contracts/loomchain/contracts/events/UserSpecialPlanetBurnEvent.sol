pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract UserSpecialPlanetBurnEvent is MinterRole {
  event Burn(uint24 indexed id, bytes32 data);

  function emitEvent(uint24 id, bytes32 data) public onlyMinter {
    emit Burn(id, data);
  }
}
