pragma solidity 0.4.24;

import "./SpecialPlanet.sol";

contract SpecialPlanetShop {
  SpecialPlanet private _specialPlanet;
  uint256 public tmpIdGenerator;

  constructor(address specialPlanetAddress) public {
    _specialPlanet = SpecialPlanet(specialPlanetAddress);
  }

  function specialPlanet() external view returns (SpecialPlanet) {
    return _specialPlanet;
  }

  // TODO: get eth
  function sell() external returns (uint256) {
    tmpIdGenerator++; // TODO: correct id
    _specialPlanet.mint(msg.sender, tmpIdGenerator);
    return tmpIdGenerator;
  }
}
