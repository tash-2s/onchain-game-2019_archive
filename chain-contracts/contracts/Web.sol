pragma solidity 0.4.24;

import "./Gold.sol";
import "./UserNormalPlanet.sol";

contract Web {
  UserNormalPlanet public userNormalPlanet;
  Gold public gold;

  constructor(
    address userNormalPlanetContractAddress,
    address goldContractAddress
  ) public {
    userNormalPlanet = UserNormalPlanet(userNormalPlanetContractAddress);
    gold = Gold(goldContractAddress);
  }

  function getUser(address account)
    external
    view
    returns (
    uint256 confirmedGold,
    uint40 goldConfirmedAt,
    uint16[] unpIds, // [id, normalPlanetId, ...]
    uint8[] unpRanks,
    uint256[] unpTimes, // [rankupedAt, createdAt, ...]
    uint16[] unpAxialCoordinates // [q, r, ...]
  )
  {
    confirmedGold = gold.balanceOf(account);
    goldConfirmedAt = 0; // TODO

    uint256[] memory userPlanets = new uint256[](
      userNormalPlanet.balanceOf(account)
    );
    userPlanets = userNormalPlanet.userPlanets(account);
    uint userPlanetsCount = userPlanets.length / 7;

    unpIds = new uint16[](userPlanetsCount * 2);
    unpRanks = new uint8[](userPlanetsCount);
    unpTimes = new uint[](userPlanetsCount * 2);
    unpAxialCoordinates = new uint16[](userPlanetsCount * 2);
    uint counter = 0;
    uint userPlanetCounter = 0;

    for (uint i = 0; i < userPlanetsCount; i++) {
      unpIds[counter] = uint16(userPlanets[userPlanetCounter + 0]);
      unpIds[counter + 1] = uint16(userPlanets[userPlanetCounter + 1]);
      unpRanks[i] = uint8(userPlanets[userPlanetCounter + 2]);
      unpTimes[counter] = userPlanets[userPlanetCounter + 3];
      unpTimes[counter + 1] = userPlanets[userPlanetCounter + 4];
      unpAxialCoordinates[counter] = uint16(userPlanets[userPlanetCounter + 5]);
      unpAxialCoordinates[counter + 1] = uint16(
        userPlanets[userPlanetCounter + 6]
      );

      counter += 2;
      userPlanetCounter += 7;
    }
  }
}
