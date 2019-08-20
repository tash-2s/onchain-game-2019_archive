pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract UserSpecialPlanetBurnEvent is MinterRole {
  event Burn(uint24 indexed id, bytes32 data);

  function emitEvent(uint24 id, bytes32 data) public onlyMinter {
    emit Burn(id, data);
  }
}
