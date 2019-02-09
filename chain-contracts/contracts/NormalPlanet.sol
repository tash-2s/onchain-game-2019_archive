pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract NormalPlanet is Ownable {
  struct Planet {
    uint8 kind;
    uint16 param;
    uint200 priceGold;
    bool _exists;
  }

  mapping(uint16 => Planet) private _planets;

  function isPlanet(uint16 id) public view returns (bool) {
    return _planets[id]._exists;
  }

  function planet(uint16 id) public view returns (uint8, uint16, uint256) {
    require(isPlanet(id), "planet is not found");
    return (_planets[id].kind, _planets[id].param, _planets[id].priceGold);
  }

  function create(uint16 id, uint8 kind, uint16 param, uint200 priceGold)
    public
    onlyOwner
  {
    require(!isPlanet(id), "id is already used");
    _planets[id] = Planet(kind, param, priceGold, true);
  }
}
