pragma solidity 0.5.11;

import "@openzeppelin/contracts/math/SafeMath.sol";

import "../../libraries/MyMath.sol";

import "./UserNormalPlanetControllable.sol";
import "./SpecialPlanetControllable.sol";
import "./UserGoldControllable.sol";

import "../../misc/SpecialPlanetTokenLocker.sol";

contract UserPlanetControllable is
  UserNormalPlanetControllable,
  SpecialPlanetControllable,
  UserGoldControllable
{
  using SafeMath for uint256;
  using MyMath for uint256;

  SpecialPlanetTokenLocker public specialPlanetTokenLocker;

  function setupUserPlanetControllable(
    address userNormalPlanetPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address specialPlanetIdToDataPermanenceAddress,
    address userGoldPermanenceAddress,
    address specialPlanetTokenLockerAddress
  ) internal {
    userNormalPlanetPermanence = UserNormalPlanetPermanence(userNormalPlanetPermanenceAddress);
    userSpecialPlanetPermanence = UserSpecialPlanetPermanence(userSpecialPlanetPermanenceAddress);
    specialPlanetIdToDataPermanence = SpecialPlanetIdToDataPermanence(
      specialPlanetIdToDataPermanenceAddress
    );
    userGoldPermanence = UserGoldPermanence(userGoldPermanenceAddress);
    specialPlanetTokenLocker = SpecialPlanetTokenLocker(specialPlanetTokenLockerAddress);
  }

  function confirm(address account) internal returns (uint256) {
    (uint256 normalPopulation, uint256 normalProductivity, uint256 knowledge, uint256 biggestUserNormalPlanetPopulation, uint256 biggestUserNormalPlanetProductivity) = _calculateUserNormalPlanetParams(
      account
    );
    (uint256 specialPopulation, uint256 specialProductivity) = _calculateUserSpecialPlanetParams(
      account,
      biggestUserNormalPlanetPopulation,
      biggestUserNormalPlanetProductivity
    );

    uint256 population = normalPopulation.add(specialPopulation);
    uint256 productivity = normalProductivity.add(specialProductivity);

    uint256 goldPerSec = population.mul(productivity);
    uint256 diffSec = uint256(TimeGetter.uint32now()).sub(userGoldRecordOf(account).confirmedAt);
    uint256 diffGold = goldPerSec.mul(diffSec);

    if (diffGold > 0) {
      mintGold(account, diffGold);
    } else {
      touchGold(account);
    }

    return knowledge;
  }

  function _calculateUserNormalPlanetParams(address account)
    private
    view
    returns (uint256, uint256, uint256, uint256, uint256)
  {
    uint256 population = 0;
    uint256 productivity = 0;
    uint256 knowledge = 0;

    uint256 biggestUserNormalPlanetPopulation = 0;
    uint256 biggestUserNormalPlanetProductivity = 0;

    UserNormalPlanetRecord[] memory userPlanets = userNormalPlanetRecordsOf(account);

    for (uint256 i = 0; i < userPlanets.length; i++) {
      UserNormalPlanetRecord memory userPlanet = userPlanets[i];
      uint256 prevRank = uint256(userPlanet.rank).sub(1);
      uint256 rated = uint256(10)
        .pow(userPlanet.originalParamCommonLogarithm)
        .mul(uint256(13).pow(prevRank))
        .div(uint256(10).pow(prevRank));

      if (userPlanet.kind == 1) {
        population = population.add(rated);
        if (rated > biggestUserNormalPlanetPopulation) {
          biggestUserNormalPlanetPopulation = rated;
        }
      } else if (userPlanet.kind == 2) {
        productivity = productivity.add(rated);
        if (rated > biggestUserNormalPlanetProductivity) {
          biggestUserNormalPlanetProductivity = rated;
        }
      } else if (userPlanet.kind == 3) {
        knowledge = knowledge.add(rated);
      } else {
        revert("undefined normal planet kind");
      }
    }

    return (
      population,
      productivity,
      knowledge,
      biggestUserNormalPlanetPopulation,
      biggestUserNormalPlanetProductivity
    );
  }

  function _calculateUserSpecialPlanetParams(
    address account,
    uint256 biggestUserNormalPlanetPopulation,
    uint256 biggestUserNormalPlanetProductivity
  ) private view returns (uint256, uint256) {
    uint256 population = 0;
    uint256 productivity = 0;

    UserSpecialPlanetRecord[] memory userPlanets = userSpecialPlanetRecordsOf(account);

    for (uint16 i = 0; i < userPlanets.length; i++) {
      UserSpecialPlanetRecord memory userPlanet = userPlanets[i];

      if (userPlanet.kind == 1) {
        population = population.add(biggestUserNormalPlanetPopulation.mul(userPlanet.paramRate));
      } else if (userPlanet.kind == 2) {
        productivity = productivity.add(
          biggestUserNormalPlanetProductivity.mul(userPlanet.paramRate)
        );
      } else {
        revert("undefined or unsupported special planet kind");
      }
    }

    return (population, productivity);
  }

  function removeSpecialPlanetFromMap(address account, uint24 shortId) internal {
    removeUserSpecialPlanetFromMap(account, shortId);
    specialPlanetTokenLocker.withdraw(shortId);
  }

  function removePlanetsFromMapIfExist(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal {
    removeUserNormalPlanetFromMapIfExist(account, coordinateQs, coordinateRs);
    removeSpecialPlanetFromMapIfExist(account, coordinateQs, coordinateRs);
  }

  function removeSpecialPlanetFromMapIfExist(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal {
    uint24[] memory shortIds = removeUserSpecialPlanetFromMapIfExist(
      account,
      coordinateQs,
      coordinateRs
    );
    for (uint256 i = 0; i < shortIds.length; i++) {
      specialPlanetTokenLocker.withdraw(shortIds[i]);
    }
  }
}
