pragma solidity 0.5.13;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/drafts/SignedSafeMath.sol";

import "../libraries/MyMath.sol";
import "../libraries/UserAsteriskMapUtil.sol";

import "./modules/InGameAsteriskControllable.sol";
import "./modules/UserAsteriskControllable.sol";

import "../permanences/UserInGameAsteriskIdGeneratorPermanence.sol";

contract InGameAsteriskController is InGameAsteriskControllable, UserAsteriskControllable {
  using SafeMath for uint256;
  using MyMath for uint256;
  using SignedSafeMath for int256;

  UserInGameAsteriskIdGeneratorPermanence public userInGameAsteriskIdGeneratorPermanence;

  constructor(
    address userInGameAsteriskPermanenceAddress,
    address userInGameAsteriskIdGeneratorPermanenceAddress,
    address userTradableAsteriskPermanenceAddress,
    address tradableAsteriskIdToDataPermanenceAddress,
    address userGoldPermanenceAddress,
    address inGameAsteriskPermanenceAddress
  ) public {
    setupUserAsteriskControllable(
      userInGameAsteriskPermanenceAddress,
      userTradableAsteriskPermanenceAddress,
      tradableAsteriskIdToDataPermanenceAddress,
      userGoldPermanenceAddress
    );
    inGameAsteriskPermanence = InGameAsteriskPermanence(inGameAsteriskPermanenceAddress);
    userInGameAsteriskIdGeneratorPermanence = UserInGameAsteriskIdGeneratorPermanence(
      userInGameAsteriskIdGeneratorPermanenceAddress
    );
  }

  function getAsterisks(address account)
    external
    view
    returns (
      uint200 confirmedGold,
      uint32 goldConfirmedAt,
      uint64[] memory ids, // [id, inGameAsteriskId, ...]
      uint8[] memory ranks,
      uint32[] memory times, // [rankupedAt, createdAt, ...]
      int16[] memory coordinates // [q, r, ...]
    )
  {
    UserGoldRecord memory goldRecord = userGoldRecordOf(account);
    confirmedGold = goldRecord.balance;
    goldConfirmedAt = goldRecord.confirmedAt;

    UserInGameAsteriskRecord[] memory userAsteriskRecords = userInGameAsteriskRecordsOf(account);
    uint256 userAsterisksCount = userAsteriskRecords.length;

    ids = new uint64[](userAsterisksCount * 2);
    ranks = new uint8[](userAsterisksCount);
    times = new uint32[](userAsterisksCount * 2);
    coordinates = new int16[](userAsterisksCount * 2);

    for (uint256 i = 0; i < userAsterisksCount; i++) {
      ids[i * 2] = userAsteriskRecords[i].id;
      ids[i * 2 + 1] = userAsteriskRecords[i].inGameAsteriskId;
      ranks[i] = userAsteriskRecords[i].rank;
      times[i * 2] = userAsteriskRecords[i].rankupedAt;
      times[i * 2 + 1] = userAsteriskRecords[i].createdAt;
      coordinates[i * 2] = userAsteriskRecords[i].coordinateQ;
      coordinates[i * 2 + 1] = userAsteriskRecords[i].coordinateR;
    }
  }

  function setAsterisks(
    uint16 asteriskId,
    int16[] calldata coordinateQs,
    int16[] calldata coordinateRs
  ) external {
    require(
      coordinateQs.length == coordinateRs.length && coordinateQs.length > 0,
      "invalid coordinate arg"
    );
    uint16 batchSize = uint16(coordinateQs.length);
    InGameAsteriskRecord memory asteriskRecord = inGameAsteriskRecordOf(asteriskId);

    confirm(msg.sender);

    uint256 balance = userGoldRecordOf(msg.sender).balance;
    uint256 asteriskPrice = uint256(10).pow(asteriskRecord.priceGoldCommonLogarithm);

    unmintGold(msg.sender, asteriskPrice.mul(batchSize));

    revertIfCoordinatesAreUsed(msg.sender, coordinateQs, coordinateRs);

    uint64[] memory ids = userInGameAsteriskIdGeneratorPermanence.generate(msg.sender, batchSize);

    for (uint16 i = 0; i < batchSize; i++) {
      require(
        UserAsteriskMapUtil.isInUsableRadius(coordinateQs[i], coordinateRs[i], balance),
        "not allowed coordinate"
      );

      setInGameAsteriskToMap(
        msg.sender,
        ids[i],
        asteriskRecord.id,
        asteriskRecord.kind,
        asteriskRecord.paramCommonLogarithm,
        coordinateQs[i],
        coordinateRs[i]
      );

      balance = balance.sub(asteriskPrice);
    }
  }

  function rankupAsterisks(uint64[] calldata userInGameAsteriskIds, uint8[] calldata targetRanks)
    external
  {
    require(
      userInGameAsteriskIds.length == targetRanks.length && userInGameAsteriskIds.length > 0,
      "invalid arg"
    );
    uint256 knowledge = confirm(msg.sender);
    (UserInGameAsteriskRecord[] memory userAsterisks, uint256[] memory userAsteriskIndexes) = userInGameAsteriskRecordsWithIndexesOf(
      msg.sender,
      userInGameAsteriskIds
    );
    uint256 rankupGold = 0;

    for (uint256 i = 0; i < userAsterisks.length; i++) {
      uint8 targetRank = targetRanks[i];
      UserInGameAsteriskRecord memory userAsterisk = userAsterisks[i];

      require(
        targetRank > userAsterisk.rank && targetRank <= MAX_USER_NORMAL_PLANET_RANK,
        "invalid rank for rankup"
      );

      // ckeck time
      if (targetRank == uint256(userAsterisk.rank).add(1)) {
        uint256 diffSec = uint256(Time.uint32now()).sub(userAsterisk.rankupedAt);
        int256 remainingSec = int256(_requiredSecForRankup(userAsterisk.rank))
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
      uint256 asteriskPriceGold = uint256(10).pow(
        inGameAsteriskRecordOf(userAsterisk.inGameAsteriskId).priceGoldCommonLogarithm
      );
      rankupGold = rankupGold.add(
        _requiredGoldForRankup(asteriskPriceGold, userAsterisk.rank, targetRank)
      );

      rankupUserInGameAsterisk(msg.sender, userAsterisk, userAsteriskIndexes[i], targetRank);
    }

    unmintGold(msg.sender, rankupGold);
  }

  function removeAsterisks(uint64[] calldata userInGameAsteriskIds) external {
    require(userInGameAsteriskIds.length > 0, "invalid arg");
    confirm(msg.sender);
    removeInGamesFromMap(msg.sender, userInGameAsteriskIds);
  }

  function claimInitialGold() external {
    require(
      userInGameAsteriskRecordsCountOf(msg.sender) == 0 &&
        userGoldRecordOf(msg.sender).balance == 0,
      "false condition for initial gold"
    );

    mintGold(
      msg.sender,
      uint256(10).pow(4).add(uint256(10).pow(5)) // (id:1 price) + (id:2 price)
    );
  }

  function _requiredGoldForRankup(
    uint256 asteriskPriceGold,
    uint256 currentRank,
    uint256 targetRank
  ) private pure returns (uint256) {
    uint256 requiredGold = 0;
    uint256 tmpRank = currentRank;

    while (tmpRank < targetRank) {
      uint256 prevTmpRank = tmpRank.sub(1);
      requiredGold = requiredGold.add(
        (asteriskPriceGold.mul(uint256(14).pow(prevTmpRank))).div(uint256(10).pow(prevTmpRank))
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
