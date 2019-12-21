pragma solidity 0.5.13;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "../../libraries/MyMath.sol";

import "./UserInGameAsteriskControllable.sol";
import "./TradableAsteriskControllable.sol";
import "./UserGoldControllable.sol";

contract UserAsteriskControllable is
  UserInGameAsteriskControllable,
  TradableAsteriskControllable,
  UserGoldControllable
{
  using SafeMath for uint256;
  using MyMath for uint256;

  function setupUserAsteriskControllable(
    address userInGameAsteriskPermanenceAddress,
    address userTradableAsteriskPermanenceAddress,
    address tradableAsteriskIdToDataPermanenceAddress,
    address userGoldPermanenceAddress
  ) internal {
    userInGameAsteriskPermanence = UserInGameAsteriskPermanence(userInGameAsteriskPermanenceAddress);
    userTradableAsteriskPermanence = UserTradableAsteriskPermanence(userTradableAsteriskPermanenceAddress);
    tradableAsteriskIdToDataPermanence = TradableAsteriskIdToDataPermanence(
      tradableAsteriskIdToDataPermanenceAddress
    );
    userGoldPermanence = UserGoldPermanence(userGoldPermanenceAddress);
  }

  function confirm(address account) internal returns (uint256) {
    (uint256 inGamePopulation, uint256 inGameProductivity, uint256 knowledge, uint256 biggestUserInGameAsteriskPopulation, uint256 biggestUserInGameAsteriskProductivity) = _calculateUserInGameAsteriskParams(
      account
    );
    (uint256 tradablePopulation, uint256 tradableProductivity) = _calculateUserTradableAsteriskParams(
      account,
      biggestUserInGameAsteriskPopulation,
      biggestUserInGameAsteriskProductivity
    );

    uint256 population = inGamePopulation.add(tradablePopulation);
    uint256 productivity = inGameProductivity.add(tradableProductivity);

    uint256 goldPerSec = population.mul(productivity);
    uint256 diffSec = uint256(Time.uint32now()).sub(userGoldRecordOf(account).confirmedAt);
    uint256 diffGold = goldPerSec.mul(diffSec);

    if (diffGold > 0) {
      mintGold(account, diffGold);
    } else {
      touchGold(account);
    }

    return knowledge;
  }

  function _calculateUserInGameAsteriskParams(address account)
    private
    view
    returns (uint256, uint256, uint256, uint256, uint256)
  {
    uint256 population = 0;
    uint256 productivity = 0;
    uint256 knowledge = 0;

    uint256 biggestUserInGameAsteriskPopulation = 0;
    uint256 biggestUserInGameAsteriskProductivity = 0;

    UserInGameAsteriskRecord[] memory userAsterisks = userInGameAsteriskRecordsOf(account);

    for (uint256 i = 0; i < userAsterisks.length; i++) {
      UserInGameAsteriskRecord memory userAsterisk = userAsterisks[i];
      uint256 prevRank = uint256(userAsterisk.rank).sub(1);
      uint256 rated = uint256(10)
        .pow(userAsterisk.originalParamCommonLogarithm)
        .mul(uint256(13).pow(prevRank))
        .div(uint256(10).pow(prevRank));

      if (userAsterisk.kind == 1) {
        population = population.add(rated);
        if (rated > biggestUserInGameAsteriskPopulation) {
          biggestUserInGameAsteriskPopulation = rated;
        }
      } else if (userAsterisk.kind == 2) {
        productivity = productivity.add(rated);
        if (rated > biggestUserInGameAsteriskProductivity) {
          biggestUserInGameAsteriskProductivity = rated;
        }
      } else if (userAsterisk.kind == 3) {
        knowledge = knowledge.add(rated);
      } else {
        revert("undefined inGame asterisk kind");
      }
    }

    return (
      population,
      productivity,
      knowledge,
      biggestUserInGameAsteriskPopulation,
      biggestUserInGameAsteriskProductivity
    );
  }

  function _calculateUserTradableAsteriskParams(
    address account,
    uint256 biggestUserInGameAsteriskPopulation,
    uint256 biggestUserInGameAsteriskProductivity
  ) private view returns (uint256, uint256) {
    uint256 population = 0;
    uint256 productivity = 0;

    UserTradableAsteriskRecord[] memory userAsterisks = userTradableAsteriskRecordsOf(account);

    for (uint16 i = 0; i < userAsterisks.length; i++) {
      UserTradableAsteriskRecord memory userAsterisk = userAsterisks[i];

      if (userAsterisk.kind == 1) {
        population = population.add(biggestUserInGameAsteriskPopulation.mul(userAsterisk.paramRate));
      } else if (userAsterisk.kind == 2) {
        productivity = productivity.add(
          biggestUserInGameAsteriskProductivity.mul(userAsterisk.paramRate)
        );
      } else {
        revert("undefined or unsupported tradable asterisk kind");
      }
    }

    return (population, productivity);
  }

  function revertIfCoordinatesAreUsed(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal view {
    revertIfCoordinatesAreUsedByInGame(account, coordinateQs, coordinateRs);
    revertIfCoordinatesAreUsedByTradable(account, coordinateQs, coordinateRs);
  }
}
