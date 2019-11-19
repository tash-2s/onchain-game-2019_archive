pragma solidity 0.5.11;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./modules/NormalPlanetControllable.sol";
import "./modules/UserPlanetControllable.sol";
import "./modules/UserPlanetMapUtil.sol";

contract NormalPlanetController is
  NormalPlanetControllable,
  UserPlanetControllable,
  UserPlanetMapUtil
{
  constructor(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdGeneratorPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address specialPlanetIdToDataPermanenceAddress,
    address userGoldPermanenceAddress,
    address normalPlanetPermanenceAddress,
    address specialPlanetTokenLockerAddress
  ) public {
    setupUserPlanetControllable(
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdGeneratorPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      specialPlanetIdToDataPermanenceAddress,
      userGoldPermanenceAddress,
      specialPlanetTokenLockerAddress
    );
    setNormalPlanetPermanence(normalPlanetPermanenceAddress);
  }

  function getPlanets(address account)
    external
    view
    returns (
      uint200 confirmedGold,
      uint32 goldConfirmedAt,
      uint64[] memory ids, // [id, normalPlanetId, ...]
      uint8[] memory ranks,
      uint32[] memory times, // [rankupedAt, createdAt, ...]
      int16[] memory coordinates // [q, r, ...]
    )
  {
    UserGoldRecord memory goldRecord = userGoldRecordOf(account);
    confirmedGold = goldRecord.balance;
    goldConfirmedAt = goldRecord.confirmedAt;

    UserNormalPlanetRecord[] memory userPlanetRecords = userNormalPlanetRecordsOf(account);
    uint16 userPlanetsCount = uint16(userPlanetRecords.length);

    ids = new uint64[](userPlanetsCount * 2);
    ranks = new uint8[](userPlanetsCount);
    times = new uint32[](userPlanetsCount * 2);
    coordinates = new int16[](userPlanetsCount * 2);
    uint24 counter = 0;

    for (uint16 i = 0; i < userPlanetsCount; i++) {
      ids[counter] = userPlanetRecords[i].id;
      ids[counter + 1] = userPlanetRecords[i].normalPlanetId;
      ranks[i] = userPlanetRecords[i].rank;
      times[counter] = userPlanetRecords[i].rankupedAt;
      times[counter + 1] = userPlanetRecords[i].createdAt;
      coordinates[counter] = userPlanetRecords[i].coordinateQ;
      coordinates[counter + 1] = userPlanetRecords[i].coordinateR;

      counter += 2;
    }
  }

  function setPlanets(uint16 planetId, int16[] calldata coordinateQs, int16[] calldata coordinateRs)
    external
  {
    require(coordinateQs.length == coordinateRs.length, "invalid coordinate arg");
    NormalPlanetRecord memory planetRecord = normalPlanetRecordOf(planetId);

    confirm(msg.sender);

    uint200 balance = userGoldRecordOf(msg.sender).balance;
    uint200 planetPrice = uint200(uint256(10)**planetRecord.priceGoldCommonLogarithm);

    unmintGold(msg.sender, planetPrice * coordinateQs.length); // type?

    removePlanetsFromMapIfExist(msg.sender, coordinateQs, coordinateRs);

    for (uint256 i = 0; i < coordinateQs.length; i++) {
      require(
        isInRadius(coordinateQs[i], coordinateRs[i], usableRadiusFromGold(balance)),
        "not allowed coordinate"
      );

      setNormalPlanetToMap(
        msg.sender,
        planetId,
        planetRecord.kind,
        planetRecord.paramCommonLogarithm,
        coordinateQs[i],
        coordinateRs[i]
      );

      balance -= planetPrice;
    }
  }

  function rankupPlanet(uint64 userNormalPlanetId, uint8 targetRank) external {
    uint256 knowledge = confirm(msg.sender);
    uint256 rankupGold = _rankupPlanet(knowledge, userNormalPlanetId, targetRank);
    unmintGold(msg.sender, rankupGold);
  }

  function rankupPlanets(uint64[] calldata userNormalPlanetIds, uint8[] calldata targetRanks)
    external
  {
    uint256 knowledge = confirm(msg.sender);
    uint256 rankupGold = 0;
    for (uint256 i = 0; i < userNormalPlanetIds.length; i++) {
      rankupGold += _rankupPlanet(knowledge, userNormalPlanetIds[i], targetRanks[i]);
    }
    unmintGold(msg.sender, rankupGold);
  }

  function claimInitialGold() external {
    require(
      userNormalPlanetRecordsCountOf(msg.sender) == 0 && userGoldRecordOf(msg.sender).balance == 0,
      "false condition for initial gold"
    );

    mintGold(
      msg.sender,
      uint256(10)**normalPlanetRecordOf(1).priceGoldCommonLogarithm +
        uint256(10)**normalPlanetRecordOf(2).priceGoldCommonLogarithm
    );
  }

  function _rankupPlanet(uint256 knowledge, uint64 userNormalPlanetId, uint8 targetRank)
    private
    returns (uint256)
  {
    UserNormalPlanetRecord memory userPlanet = userNormalPlanetRecordOf(
      msg.sender,
      userNormalPlanetId
    );

    if (targetRank <= userPlanet.rank || targetRank > MAX_USER_NORMAL_PLANET_RANK) {
      revert("invalid targetRank");
    }

    // ckeck time
    if (targetRank == (userPlanet.rank + 1)) {
      uint256 diffSec = uint32now() - userPlanet.rankupedAt;
      int256 remainingSec = int256(_requiredSecForRankup(userPlanet.rank)) -
        int256(diffSec) -
        int256(knowledge); // TODO: type
      require(remainingSec <= 0, "need more time to rankup");
    } else {
      require(
        _requiredSecForRankup(targetRank - 1) <= knowledge,
        "more knowledge is needed to bulk rankup"
      );
    }

    // decrease required gold
    uint256 planetPriceGold = uint256(10) **
      normalPlanetRecordOf(userPlanet.normalPlanetId).priceGoldCommonLogarithm;
    uint256 rankupGold = _requiredGoldForRankup(planetPriceGold, userPlanet.rank, targetRank);

    rankupUserNormalPlanet(msg.sender, userNormalPlanetId, targetRank);

    return rankupGold;
  }

  function _requiredGoldForRankup(uint256 planetPriceGold, uint8 currentRank, uint8 targetRank)
    private
    pure
    returns (uint256)
  {
    uint256 requiredGold = 0;
    uint8 tmpRank = currentRank;

    while (tmpRank < targetRank) {
      requiredGold +=
        (planetPriceGold * (uint256(14)**(tmpRank - 1))) /
        (uint256(10)**(tmpRank - 1));
      tmpRank++;
    }

    return requiredGold;
  }

  function _requiredSecForRankup(uint256 rank) private pure returns (uint256) {
    return (uint256(300) * uint256(14)**(rank - 1)) / uint256(10)**(rank - 1);
  }

  function removePlanet(uint64 userNormalPlanetId) external {
    confirm(msg.sender);
    removeNormalPlanetFromMap(msg.sender, userNormalPlanetId);
  }
}
