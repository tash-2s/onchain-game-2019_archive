pragma solidity 0.4.24;

import "./NormalPlanet.sol";
import "./UserNormalPlanet.sol";

contract HexLogic {
  NormalPlanet public normalPlanet;
  UserNormalPlanet public userNormalPlanet;

  constructor(
    address normalPlanetContractAddress,
    address userNormalPlanetContractAddress
  ) public {
    normalPlanet = NormalPlanet(normalPlanetContractAddress);
    userNormalPlanet = UserNormalPlanet(userNormalPlanetContractAddress);
  }

  // TODO: coordinates
  function setFirstPlanets(uint16 planetId1, uint16 planetId2) public {
    require(
      userNormalPlanet.balanceOf(msg.sender) == 0,
      "sender already has planets"
    );
    uint8 _1;
    uint16 _2;
    uint200 planet1Price;
    uint200 planet2Price;
    (_1, _2, planet1Price) = normalPlanet.planet(planetId1);
    (_1, _2, planet2Price) = normalPlanet.planet(planetId2);
    require(planet1Price + planet2Price == 10, "not defined price");
    userNormalPlanet.mint(msg.sender, planetId1);
    userNormalPlanet.mint(msg.sender, planetId2);
  }
}
