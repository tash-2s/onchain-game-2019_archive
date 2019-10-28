pragma solidity 0.5.11;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "./modules/NormalPlanetControllable.sol";
import "./modules/UserPlanetControllable.sol";

contract NormalPlanetController is NormalPlanetControllable, UserPlanetControllable {
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
      userNormalPlanetIdGeneratorPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      specialPlanetIdToDataPermanenceAddress,
      userGoldPermanenceAddress
    );
    setNormalPlanetPermanence(normalPlanetPermanenceAddress);
  }

  function setPlanet(uint16 planetId, int16 axialCoordinateQ, int16 axialCoordinateR) external {
    NormalPlanetRecord memory planetRecord = normalPlanetRecordOf(planetId);
    UserGoldRecord memory userGoldRecord = userGoldRecordOf(msg.sender);

    confirm(msg.sender);

    _setPlanet(planetRecord, userGoldRecord, planetId, axialCoordinateQ, axialCoordinateR);
  }

  // TODO: optimize
  function setPlanets(
    uint16 planetId,
    int16[] calldata axialCoordinateQs,
    int16[] calldata axialCoordinateRs
  ) external {
    NormalPlanetRecord memory planetRecord = normalPlanetRecordOf(planetId);
    UserGoldRecord memory userGoldRecord = userGoldRecordOf(msg.sender);

    confirm(msg.sender);

    for (uint256 i = 0; i < axialCoordinateQs.length; i++) {
      _setPlanet(
        planetRecord,
        userGoldRecord,
        planetId,
        axialCoordinateQs[i],
        axialCoordinateRs[i]
      );
    }
  }

  function rankupPlanet(uint64 userNormalPlanetId, uint8 targetRank) external {
    UserNormalPlanetRecord memory userPlanet = userNormalPlanetRecordOf(
      msg.sender,
      userNormalPlanetId
    );
    uint256 knowledge = confirm(msg.sender);

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
    unmintGold(msg.sender, rankupGold);

    rankupUserNormalPlanet(msg.sender, userNormalPlanetId, targetRank);
  }

  function _setPlanet(
    NormalPlanetRecord memory planetRecord,
    UserGoldRecord memory userGoldRecord,
    uint16 planetId,
    int16 axialCoordinateQ,
    int16 axialCoordinateR
  ) private {
    // TODO: this is not precise
    if (userNormalPlanetRecordsCountOf(msg.sender) == 0 && userGoldRecord.balance == 0) {
      mintGold(msg.sender, uint256(10)**normalPlanetRecordOf(2).priceGoldCommonLogarithm);
    } else {
      unmintGold(msg.sender, uint256(10)**planetRecord.priceGoldCommonLogarithm);
    }

    mintUserNormalPlanet(
      msg.sender,
      planetId,
      planetRecord.kind,
      planetRecord.paramCommonLogarithm,
      axialCoordinateQ,
      axialCoordinateR
    );
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
    unmintUserNormalPlanet(msg.sender, userNormalPlanetId);
  }
}
