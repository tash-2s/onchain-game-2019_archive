pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./modules/NormalPlanetControllable.sol";
import "./modules/UserPlanetControllable.sol";

contract NormalPlanetController is NormalPlanetControllable, UserPlanetControllable {
  constructor(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdCounterPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address userSpecialPlanetIdToOwnerPermanenceAddress,
    address userGoldPermanenceAddress,
    address normalPlanetPermanenceAddress
  ) public {
    setupUserPlanetControllable(
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdCounterPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      userSpecialPlanetIdToOwnerPermanenceAddress,
      userGoldPermanenceAddress
    );
    setNormalPlanetPermanence(normalPlanetPermanenceAddress);
  }

  function setPlanet(uint16 planetId, int16 axialCoordinateQ, int16 axialCoordinateR) external {
    NormalPlanetRecord memory planetRecord = normalPlanetRecordOf(planetId);
    UserGoldRecord memory userGoldRecord = userGoldRecordOf(msg.sender);

    // TODO: this is not precise
    if (userNormalPlanetRecordsCountOf(msg.sender) == 0 && userGoldRecord.balance == 0) {
      mintGold(msg.sender, uint256(10) ** 6);
    } else {
      confirm(msg.sender);
      unmintGold(msg.sender, uint256(10) ** planetRecord.priceGoldCommonLogarithm);
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

  function rankupPlanet(uint64 userNormalPlanetId, uint8 targetRank) external {
    UserNormalPlanetRecord memory userPlanet = userNormalPlanetRecordOf(
      msg.sender,
      userNormalPlanetId
    );
    uint knowledge = confirm(msg.sender);

    if (targetRank <= userPlanet.rank || targetRank > MAX_USER_NORMAL_PLANET_RANK) {
      revert("invalid targetRank");
    }

    // ckeck time
    if (targetRank == (userPlanet.rank + 1)) {
      uint diffSec = uint32now() - userPlanet.rankupedAt;
      int remainingSec = int(_requiredSecForRankup(userPlanet.rank)) - int(diffSec) - int(
        knowledge
      ); // TODO: type
      require(remainingSec <= 0, "need more time to rankup");
    } else {
      require(
        _requiredSecForRankup(targetRank - 1) <= knowledge,
        "more knowledge is needed to bulk rankup"
      );
    }

    // decrease required gold
    uint planetPriceGold = uint256(10) ** normalPlanetRecordOf(
      userPlanet.normalPlanetId
    ).priceGoldCommonLogarithm;
    uint rankupGold = _requiredGoldForRankup(planetPriceGold, userPlanet.rank, targetRank);
    unmintGold(msg.sender, rankupGold);

    rankupUserNormalPlanet(msg.sender, userNormalPlanetId, targetRank);
  }

  function _requiredGoldForRankup(uint planetPriceGold, uint8 currentRank, uint8 targetRank)
    private
    pure
    returns (uint)
  {
    uint requiredGold = 0;
    uint8 tmpRank = currentRank;

    while (tmpRank < targetRank) {
      requiredGold += planetPriceGold * (uint256(13) ** (tmpRank - 1)) / (uint256(
        10
      ) ** (tmpRank - 1));
      tmpRank++;
    }

    return requiredGold;
  }

  function _requiredSecForRankup(uint rank) private pure returns (uint) {
    uint i = 1;
    uint memo = 300;
    while (i < rank) {
      memo = memo * 14 / 10;
      i++;
    }
    return memo;
  }

  function removePlanet(uint64 userNormalPlanetId) external {
    confirm(msg.sender);
    unmintUserNormalPlanet(msg.sender, userNormalPlanetId);
  }
}
