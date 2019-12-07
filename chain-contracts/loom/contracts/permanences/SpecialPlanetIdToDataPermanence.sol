pragma solidity 0.5.13;

import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

contract SpecialPlanetIdToDataPermanence is WhitelistedRole {
  mapping(uint24 => bytes32) private _map;

  function read(uint24 key) public view returns (bytes32) {
    return _map[key];
  }

  function update(uint24 key, bytes32 value) public onlyWhiteliste {
    _map[key] = value;
  }
}
