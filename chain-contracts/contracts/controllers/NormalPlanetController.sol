pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./modules/UserGoldControllable.sol";
import "./modules/NormalPlanetControllable.sol";
import "./modules/UserNormalPlanetControllable.sol";
import "./RemarkableUserController.sol";

contract NormalPlanetController is UserGoldControllable, NormalPlanetControllable, UserNormalPlanetControllable {
  RemarkableUserController private _remarkableUserController;

  constructor(
    address userGoldPermanenceAddress,
    address normalPlanetPermanenceAddress,
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdCounterPermanenceAddress,
    address remarkableUsersContractAddress
  ) public {
    setUserGoldPermanence(userGoldPermanenceAddress);
    setNormalPlanetPermanence(normalPlanetPermanenceAddress);
    setUserNormalPlanetPermanence(userNormalPlanetPermanenceAddress);
    setUserNormalPlanetIdCounterPermanence(userNormalPlanetIdCounterPermanenceAddress);
    _remarkableUserController = RemarkableUserController(remarkableUsersContractAddress);
  }

  function remarkableUserController() external view returns (RemarkableUserController) {
    return _remarkableUserController;
  }

  function setPlanet(uint16 planetId, int16 axialCoordinateQ, int16 axialCoordinateR) external {
    NormalPlanetRecord memory planetRecord = normalPlanetRecordOf(planetId);
    UserGoldRecord memory userGoldRecord = userGoldRecordOf(msg.sender);

    // TODO: this is not precise
    if (userNormalPlanetRecordsCountOf(msg.sender) == 0 && userGoldRecord.balance == 0) {
      mintGold(msg.sender, uint256(10) ** planetRecord.priceGoldCommonLogarithm);
    } else {
      _confirm(msg.sender);
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
    uint techPower = _confirm(msg.sender);

    if (targetRank <= userPlanet.rank || targetRank > MAX_USER_NORMAL_PLANET_RANK) {
      revert("invalid targetRank");
    }

    // ckeck time
    if (targetRank == (userPlanet.rank + 1)) {
      uint diffSec = uint32now() - userPlanet.rankupedAt;
      int remainingSec = int(_requiredSecForRankup(userPlanet.rank)) - int(diffSec) - int(
        techPower
      ); // TODO: type
      require(remainingSec <= 0, "need more time to rankup");
    } else {
      require(
        _requiredSecForRankup(targetRank - 1) <= techPower,
        "more techPower is needed to bulk rankup"
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
    _confirm(msg.sender);
    unmintUserNormalPlanet(msg.sender, userNormalPlanetId);
  }

  function _confirm(address account) private returns (uint) {
    uint population = 0;
    uint goldPower = 0;
    uint techPower = 0;

    UserNormalPlanetRecord[] memory userPlanets = userNormalPlanetRecordsOf(account);
    UserNormalPlanetRecord memory userPlanet;
    uint rated;

    for (uint i = 0; i < userPlanets.length; i++) {
      userPlanet = userPlanets[i];

      rated = (uint256(10) ** userPlanet.originalParamCommonLogarithm) * (uint256(
        13
      ) ** (userPlanet.rank - 1)) / (uint256(10) ** (userPlanet.rank - 1));
      if (userPlanet.kind == 1) {
        population += rated;
      } else if (userPlanet.kind == 2) {
        goldPower += rated;
      } else if (userPlanet.kind == 3) {
        techPower += rated;
      } else {
        revert("undefined kind");
      }
    }

    // TODO: type
    uint goldPerSec = population * goldPower;
    uint32 diffSec = uint32now() - userGoldRecordOf(account).confirmedAt;
    uint diffGold = goldPerSec * diffSec;

    if (diffGold > 0) {
      mintGold(account, uint200(diffGold));
      _remarkableUserController.tackle(account);
    }

    return techPower;
  }
}
