pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./Gold.sol";
import "./NormalPlanet.sol";
import "./UserNormalPlanet.sol";
import "./lib/Util.sol";

contract Logic {
  Gold public gold;
  NormalPlanet public normalPlanet;
  UserNormalPlanet public userNormalPlanet;

  constructor(
    address goldContractAddress,
    address normalPlanetContractAddress,
    address userNormalPlanetContractAddress
  ) public {
    gold = Gold(goldContractAddress);
    normalPlanet = NormalPlanet(normalPlanetContractAddress);
    userNormalPlanet = UserNormalPlanet(userNormalPlanetContractAddress);
  }

  function setPlanet(
    uint16 planetId,
    uint16 axialCoordinateQ,
    uint16 axialCoordinateR
  ) public {
    uint8 _1;
    uint16 _2;
    uint200 planetPrice;
    (_1, _2, planetPrice) = normalPlanet.planet(planetId);

    if (userNormalPlanet.balanceOf(msg.sender) == 0 && gold.balanceOf(
      msg.sender
    ) == 0) {
      gold.mint(msg.sender, uint200(SafeMath.sub(10, planetPrice)));
    } else {
      confirm(msg.sender);
      gold.unmint(msg.sender, planetPrice);
    }

    userNormalPlanet.mint(
      msg.sender,
      planetId,
      axialCoordinateQ,
      axialCoordinateR
    );
  }

  function confirm(address account) private {
    //uint totalResidenceParam = 0;
    //uint totalGoldveinParam = 0;
    //uint40[] memory userPlanets = userNormalPlanet.userPlanets(account);
    //uint userPlanetCounter = 0;
    //for (uint i = 0; i < (userPlanets.length / 7); i++) {
    //  userPlanetCounter += 7;
    //}
    //uint200 goldPerSec = totalResidenceParam * totalGoldveinParam;
    //uint40 diffSec = Util.uint40now - gold.userGoldConfirmedAt;
    //uint200 diffGold = goldPerSec * diffSec;
    //if (diffGold > 0) {
    //  gold.mint(account, diffGold)
    //}
  }

  // this is executable after delete all user planets, maybe I should create start-flag data.
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
    userNormalPlanet.mint(msg.sender, planetId1, 0, 0);
    userNormalPlanet.mint(msg.sender, planetId2, 0, 1);
  }
}
