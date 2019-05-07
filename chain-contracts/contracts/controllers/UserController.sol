pragma solidity 0.4.24;

import "./modules/UserGoldControllable.sol";
import "./modules/UserNormalPlanetControllable.sol";

contract UserController is UserGoldControllable, UserNormalPlanetControllable {
  constructor(
    address userGoldPermanenceAddress,
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdCounterPermanenceAddress
  ) public {
    setUserGoldPermanence(userGoldPermanenceAddress);
    setUserNormalPlanetPermanence(userNormalPlanetPermanenceAddress);
    setUserNormalPlanetIdCounterPermanence(userNormalPlanetIdCounterPermanenceAddress);
  }

  function getUser(address account)
    external
    view
    returns (
    uint200 confirmedGold,
    uint32 goldConfirmedAt,
    uint64[] unpIds, // [id, normalPlanetId, ...]
    uint8[] unpRanks,
    uint32[] unpTimes, // [rankupedAt, createdAt, ...]
    int16[] unpAxialCoordinates // [q, r, ...]
  )
  {
    UserGoldRecord memory goldRecord = userGoldRecordOf(account);
    confirmedGold = goldRecord.balance;
    goldConfirmedAt = goldRecord.confirmedAt;

    UserNormalPlanetRecord[] memory userPlanetRecords = userNormalPlanetRecordsOf(account);
    uint16 userPlanetsCount = uint16(userPlanetRecords.length);

    unpIds = new uint64[](userPlanetsCount * 2);
    unpRanks = new uint8[](userPlanetsCount);
    unpTimes = new uint32[](userPlanetsCount * 2);
    unpAxialCoordinates = new int16[](userPlanetsCount * 2);
    uint24 counter = 0;

    for (uint16 i = 0; i < userPlanetsCount; i++) {
      unpIds[counter] = userPlanetRecords[i].id;
      unpIds[counter + 1] = userPlanetRecords[i].normalPlanetId;
      unpRanks[i] = userPlanetRecords[i].rank;
      unpTimes[counter] = userPlanetRecords[i].rankupedAt;
      unpTimes[counter + 1] = userPlanetRecords[i].createdAt;
      unpAxialCoordinates[counter] = userPlanetRecords[i].axialCoordinateQ;
      unpAxialCoordinates[counter + 1] = userPlanetRecords[i].axialCoordinateR;

      counter += 2;
    }
  }
}
