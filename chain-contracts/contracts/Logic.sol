pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./Gold.sol";
import "./NormalPlanet.sol";
import "./UserNormalPlanet.sol";
import "./lib/Util.sol";
import "./lib/UserNormalPlanetArrayReader.sol";

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

  function setPlanet(uint16 planetId, uint16 axialCoordinateQ, uint16 axialCoordinateR) public {
    (, , uint200 planetPrice) = normalPlanet.planet(planetId);

    // this is not precise
    if (userNormalPlanet.balanceOf(msg.sender) == 0 && gold.balanceOf(msg.sender) == 0) {
      gold.mint(msg.sender, uint200(SafeMath.sub(10, planetPrice)));
    } else {
      confirm(msg.sender);
      gold.unmint(msg.sender, planetPrice);
    }

    userNormalPlanet.mint(msg.sender, planetId, axialCoordinateQ, axialCoordinateR);
  }

  function confirm(address account) private {
    uint totalResidenceParam = 0;
    uint totalGoldveinParam = 0;
    uint40[] memory userPlanets = userNormalPlanet.userPlanets(account);
    for (uint i = 0; i < UserNormalPlanetArrayReader.userPlanetsCount(userPlanets); i++) {
      if (UserNormalPlanetArrayReader.kind(userPlanets, i) == 1) {
        totalResidenceParam += UserNormalPlanetArrayReader.ratedParam(userPlanets, i);
      } else if (UserNormalPlanetArrayReader.kind(userPlanets, i) == 2) {
        totalGoldveinParam += UserNormalPlanetArrayReader.ratedParam(userPlanets, i);
      } else {
        revert("undefined kind");
      }
    }

    // TODO: type
    uint goldPerSec = totalResidenceParam * totalGoldveinParam;
    uint40 diffSec = Util.uint40now() - gold.userGoldConfirmedAt(account);
    uint diffGold = goldPerSec * diffSec;

    if (diffGold > 0) {
      gold.mint(account, uint200(diffGold));
    }
  }

  // TODO: rankup fee/cooldown check
  function rankupUserNormalPlanet(uint16 userNormalPlanetId) public {
    confirm(msg.sender);
    userNormalPlanet.rankup(msg.sender, userNormalPlanetId);
  }
}
