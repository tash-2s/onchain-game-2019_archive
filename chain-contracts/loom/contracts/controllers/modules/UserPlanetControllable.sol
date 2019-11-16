pragma solidity 0.5.11;

import "./UserNormalPlanetControllable.sol";
import "./SpecialPlanetControllable.sol";
import "./UserGoldControllable.sol";

import "../../misc/SpecialPlanetTokenLocker.sol";

contract UserPlanetControllable is
  UserNormalPlanetControllable,
  SpecialPlanetControllable,
  UserGoldControllable
{
  SpecialPlanetTokenLocker public specialPlanetTokenLocker;

  function setupUserPlanetControllable(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdGeneratorPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address specialPlanetIdToDataPermanenceAddress,
    address userGoldPermanenceAddress,
    address specialPlanetTokenLockerAddress
  ) internal {
    setUserNormalPlanetPermanence(userNormalPlanetPermanenceAddress);
    setUserNormalPlanetIdGeneratorPermanence(userNormalPlanetIdGeneratorPermanenceAddress);
    setUserSpecialPlanetPermanence(userSpecialPlanetPermanenceAddress);
    setSpecialPlanetIdToDataPermanence(specialPlanetIdToDataPermanenceAddress);
    setUserGoldPermanence(userGoldPermanenceAddress);
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

    uint256 population = normalPopulation + specialPopulation;
    uint256 productivity = normalProductivity + specialProductivity;

    // TODO: type
    uint256 goldPerSec = population * productivity;
    uint32 diffSec = uint32now() - userGoldRecordOf(account).confirmedAt;
    uint256 diffGold = goldPerSec * diffSec;

    if (diffGold > 0) {
      mintGold(account, uint200(diffGold));
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
    UserNormalPlanetRecord memory userPlanet;
    uint256 rated;

    for (uint16 i = 0; i < userPlanets.length; i++) {
      userPlanet = userPlanets[i];

      rated =
        ((uint256(10)**userPlanet.originalParamCommonLogarithm) *
          (uint256(13)**(userPlanet.rank - 1))) /
        (uint256(10)**(userPlanet.rank - 1));

      if (userPlanet.kind == 1) {
        population += rated;
        if (rated > biggestUserNormalPlanetPopulation) {
          biggestUserNormalPlanetPopulation = rated;
        }
      } else if (userPlanet.kind == 2) {
        productivity += rated;
        if (rated > biggestUserNormalPlanetProductivity) {
          biggestUserNormalPlanetProductivity = rated;
        }
      } else if (userPlanet.kind == 3) {
        knowledge += rated;
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
    UserSpecialPlanetRecord memory userPlanet;

    for (uint16 i = 0; i < userPlanets.length; i++) {
      userPlanet = userPlanets[i];

      if (userPlanet.kind == 1) {
        population += biggestUserNormalPlanetPopulation * userPlanet.paramRate;
      } else if (userPlanet.kind == 2) {
        productivity += biggestUserNormalPlanetProductivity * userPlanet.paramRate;
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

  function removeSpecialPlanetFromMapIfExist(address account, int16 coordinateQ, int16 coordinateR)
    internal
  {
    uint24 shortId = removeUserSpecialPlanetFromMapIfExist(account, coordinateQ, coordinateR);
    if (shortId != 0) {
      specialPlanetTokenLocker.withdraw(shortId);
    }
  }
}
