pragma solidity 0.5.13;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/drafts/SignedSafeMath.sol";

import "../libraries/MyMath.sol";
import "../libraries/UserPlanetMapUtil.sol";

import "./modules/NormalPlanetControllable.sol";
import "./modules/UserPlanetControllable.sol";

import "../permanences/UserNormalPlanetIdGeneratorPermanence.sol";

contract NormalPlanetController is NormalPlanetControllable, UserPlanetControllable {
  using SafeMath for uint256;
  using MyMath for uint256;
  using SignedSafeMath for int256;

  UserNormalPlanetIdGeneratorPermanence public userNormalPlanetIdGeneratorPermanence;

  constructor(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdGeneratorPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address specialPlanetIdToDataPermanenceAddress,
    address userGoldPermanenceAddress,
    address normalPlanetPermanenceAddress
  ) public {
    setupUserPlanetControllable(
      userNormalPlanetPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      specialPlanetIdToDataPermanenceAddress,
      userGoldPermanenceAddress
    );
    normalPlanetPermanence = NormalPlanetPermanence(normalPlanetPermanenceAddress);
    userNormalPlanetIdGeneratorPermanence = UserNormalPlanetIdGeneratorPermanence(
      userNormalPlanetIdGeneratorPermanenceAddress
    );
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
    uint256 userPlanetsCount = userPlanetRecords.length;

    ids = new uint64[](userPlanetsCount * 2);
    ranks = new uint8[](userPlanetsCount);
    times = new uint32[](userPlanetsCount * 2);
    coordinates = new int16[](userPlanetsCount * 2);

    for (uint256 i = 0; i < userPlanetsCount; i++) {
      ids[i * 2] = userPlanetRecords[i].id;
      ids[i * 2 + 1] = userPlanetRecords[i].normalPlanetId;
      ranks[i] = userPlanetRecords[i].rank;
      times[i * 2] = userPlanetRecords[i].rankupedAt;
      times[i * 2 + 1] = userPlanetRecords[i].createdAt;
      coordinates[i * 2] = userPlanetRecords[i].coordinateQ;
      coordinates[i * 2 + 1] = userPlanetRecords[i].coordinateR;
    }
  }

  function setPlanets(uint16 planetId, int16[] calldata coordinateQs, int16[] calldata coordinateRs)
    external
  {
    require(
      coordinateQs.length == coordinateRs.length && coordinateQs.length > 0,
      "invalid coordinate arg"
    );
    uint16 batchSize = uint16(coordinateQs.length);
    NormalPlanetRecord memory planetRecord = normalPlanetRecordOf(planetId);

    confirm(msg.sender);

    uint256 balance = userGoldRecordOf(msg.sender).balance;
    uint256 planetPrice = uint256(10).pow(planetRecord.priceGoldCommonLogarithm);

    unmintGold(msg.sender, planetPrice.mul(batchSize));

    revertIfCoordinatesAreUsed(msg.sender, coordinateQs, coordinateRs);

    uint64[] memory ids = userNormalPlanetIdGeneratorPermanence.generate(msg.sender, batchSize);

    for (uint16 i = 0; i < batchSize; i++) {
      require(
        UserPlanetMapUtil.isInUsableRadius(coordinateQs[i], coordinateRs[i], balance),
        "not allowed coordinate"
      );

      setNormalPlanetToMap(
        msg.sender,
        ids[i],
        planetRecord.id,
        planetRecord.kind,
        planetRecord.paramCommonLogarithm,
        coordinateQs[i],
        coordinateRs[i]
      );

      balance = balance.sub(planetPrice);
    }
  }

  function rankupPlanets(uint64[] calldata userNormalPlanetIds, uint8[] calldata targetRanks)
    external
  {
    require(
      userNormalPlanetIds.length == targetRanks.length && userNormalPlanetIds.length > 0,
      "invalid arg"
    );
    uint256 knowledge = confirm(msg.sender);
    (UserNormalPlanetRecord[] memory userPlanets, uint256[] memory userPlanetIndexes) = userNormalPlanetRecordsWithIndexesOf(
      msg.sender,
      userNormalPlanetIds
    );
    uint256 rankupGold = 0;

    for (uint256 i = 0; i < userPlanets.length; i++) {
      uint8 targetRank = targetRanks[i];
      UserNormalPlanetRecord memory userPlanet = userPlanets[i];

      require(
        targetRank > userPlanet.rank && targetRank <= MAX_USER_NORMAL_PLANET_RANK,
        "invalid rank for rankup"
      );

      // ckeck time
      if (targetRank == uint256(userPlanet.rank).add(1)) {
        uint256 diffSec = uint256(Time.uint32now()).sub(userPlanet.rankupedAt);
        int256 remainingSec = int256(_requiredSecForRankup(userPlanet.rank))
          .sub(int256(diffSec))
          .sub(int256(knowledge));
        require(remainingSec <= 0, "need more time to rankup");
      } else {
        require(
          _requiredSecForRankup(uint256(targetRank).sub(1)) <= knowledge,
          "more knowledge is needed to bulk rankup"
        );
      }

      // decrease required gold
      uint256 planetPriceGold = uint256(10).pow(
        normalPlanetRecordOf(userPlanet.normalPlanetId).priceGoldCommonLogarithm
      );
      rankupGold = rankupGold.add(
        _requiredGoldForRankup(planetPriceGold, userPlanet.rank, targetRank)
      );

      rankupUserNormalPlanet(msg.sender, userPlanet, userPlanetIndexes[i], targetRank);
    }

    unmintGold(msg.sender, rankupGold);
  }

  function removePlanets(uint64[] calldata userNormalPlanetIds) external {
    require(userNormalPlanetIds.length > 0, "invalid arg");
    confirm(msg.sender);
    removeNormalsFromMap(msg.sender, userNormalPlanetIds);
  }

  function claimInitialGold() external {
    require(
      userNormalPlanetRecordsCountOf(msg.sender) == 0 && userGoldRecordOf(msg.sender).balance == 0,
      "false condition for initial gold"
    );

    mintGold(
      msg.sender,
      uint256(10).pow(4).add(uint256(10).pow(5)) // (id:1 price) + (id:2 price)
    );
  }

  function _requiredGoldForRankup(uint256 planetPriceGold, uint256 currentRank, uint256 targetRank)
    private
    pure
    returns (uint256)
  {
    uint256 requiredGold = 0;
    uint256 tmpRank = currentRank;

    while (tmpRank < targetRank) {
      uint256 prevTmpRank = tmpRank.sub(1);
      requiredGold = requiredGold.add(
        (planetPriceGold.mul(uint256(14).pow(prevTmpRank))).div(uint256(10).pow(prevTmpRank))
      );
      tmpRank = tmpRank.add(1);
    }

    return requiredGold;
  }

  function _requiredSecForRankup(uint256 rank) private pure returns (uint256) {
    uint256 prevRank = rank.sub(1);
    return uint256(300).mul(uint256(14).pow(prevRank)).div(uint256(10).pow(prevRank));
  }
}
