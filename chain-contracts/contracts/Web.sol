pragma solidity 0.4.24;

import "./controllers/UserGoldControllable.sol";
import "./UserNormalPlanet.sol";
import "./lib/UserNormalPlanetArrayReader.sol";

contract Web is UserGoldControllable {
  UserNormalPlanet public userNormalPlanet;

  constructor(address userNormalPlanetContractAddress, address userGoldPermanenceAddress) public {
    userNormalPlanet = UserNormalPlanet(userNormalPlanetContractAddress);
    setUserGoldPermanence(userGoldPermanenceAddress);
  }

  function getUser(address account)
    external
    view
    returns (
    uint200 confirmedGold,
    uint40 goldConfirmedAt,
    uint16[] unpIds, // [id, normalPlanetId, ...]
    uint8[] unpRanks,
    uint40[] unpTimes, // [rankupedAt, createdAt, ...]
    int16[] unpAxialCoordinates // [q, r, ...]
  )
  {
    UserGoldRecord memory goldRecord = userGoldRecordOf(account);
    confirmedGold = goldRecord.balance;
    goldConfirmedAt = goldRecord.confirmedAt;

    int48[] memory userPlanets = userNormalPlanet.userPlanets(account);
    uint userPlanetsCount = UserNormalPlanetArrayReader.userPlanetsCount(userPlanets);

    unpIds = new uint16[](userPlanetsCount * 2);
    unpRanks = new uint8[](userPlanetsCount);
    unpTimes = new uint40[](userPlanetsCount * 2);
    unpAxialCoordinates = new int16[](userPlanetsCount * 2);
    uint counter = 0;

    for (uint i = 0; i < userPlanetsCount; i++) {
      unpIds[counter] = UserNormalPlanetArrayReader.id(userPlanets, i);
      unpIds[counter + 1] = UserNormalPlanetArrayReader.normalPlanetId(userPlanets, i);
      unpRanks[i] = UserNormalPlanetArrayReader.rank(userPlanets, i);
      unpTimes[counter] = UserNormalPlanetArrayReader.rankupedAt(userPlanets, i);
      unpTimes[counter + 1] = UserNormalPlanetArrayReader.createdAt(userPlanets, i);
      unpAxialCoordinates[counter] = UserNormalPlanetArrayReader.axialCoordinateQ(userPlanets, i);
      unpAxialCoordinates[counter + 1] = UserNormalPlanetArrayReader.axialCoordinateR(userPlanets, i);

      counter += 2;
    }
  }
}
