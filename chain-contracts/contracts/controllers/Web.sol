pragma solidity 0.4.24;

import "./modules/UserGoldControllable.sol";
import "./modules/UserNormalPlanetControllable.sol";

contract Web is UserGoldControllable, UserNormalPlanetControllable {
  constructor(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdCounterPermanenceAddress,
    address userGoldPermanenceAddress
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
    uint16[] unpIds, // [id, normalPlanetId, ...]
    uint8[] unpRanks,
    uint32[] unpTimes, // [rankupedAt, createdAt, ...]
    int16[] unpAxialCoordinates // [q, r, ...]
  )
  {
    UserGoldRecord memory goldRecord = userGoldRecordOf(account);
    confirmedGold = goldRecord.balance;
    goldConfirmedAt = goldRecord.confirmedAt;

    UserNormalPlanetRecord[] memory userPlanetRecords = userNormalPlanetRecordsOf(account);
    uint userPlanetsCount = userPlanetRecords.length;

    unpIds = new uint16[](userPlanetsCount * 2);
    unpRanks = new uint8[](userPlanetsCount);
    unpTimes = new uint32[](userPlanetsCount * 2);
    unpAxialCoordinates = new int16[](userPlanetsCount * 2);
    uint counter = 0;

    UserNormalPlanetRecord memory userPlanetRecord;

    for (uint i = 0; i < userPlanetsCount; i++) {
      userPlanetRecord = userPlanetRecords[i];

      unpIds[counter] = userPlanetRecord.id;
      unpIds[counter + 1] = userPlanetRecord.normalPlanetId;
      unpRanks[i] = userPlanetRecord.rank;
      unpTimes[counter] = userPlanetRecord.rankupedAt;
      unpTimes[counter + 1] = userPlanetRecord.createdAt;
      unpAxialCoordinates[counter] = userPlanetRecord.axialCoordinateQ;
      unpAxialCoordinates[counter + 1] = userPlanetRecord.axialCoordinateR;

      counter += 2;
    }
  }
}
