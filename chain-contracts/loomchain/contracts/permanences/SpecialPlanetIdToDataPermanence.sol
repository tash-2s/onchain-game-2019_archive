pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract SpecialPlanetIdToDataPermanence is MinterRole {
  mapping(uint24 => bytes32) private _map;

  function read(uint24 key) public view returns (bytes32) {
    return _map[key];
  }

  function update(uint24 key, bytes32 value) public onlyMinter {
    _map[key] = value;
  }
}
