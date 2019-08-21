pragma solidity 0.5.11;

import "./UserNormalPlanetControllable.sol";
import "./UserSpecialPlanetControllable.sol";
import "./UserGoldControllable.sol";

contract UserPlanetControllable is
  UserNormalPlanetControllable,
  UserSpecialPlanetControllable,
  UserGoldControllable
{
  function setupUserPlanetControllable(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdCounterPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address specialPlanetIdToDataPermanenceAddress,
    address userGoldPermanenceAddress
  ) internal {
    setUserNormalPlanetPermanence(userNormalPlanetPermanenceAddress);
    setUserNormalPlanetIdCounterPermanence(userNormalPlanetIdCounterPermanenceAddress);
    setUserSpecialPlanetPermanence(userSpecialPlanetPermanenceAddress);
    setSpecialPlanetIdToDataPermanence(specialPlanetIdToDataPermanenceAddress);
    setUserGoldPermanence(userGoldPermanenceAddress);
  }

  function confirm(address account) internal returns (uint256) {
    (uint256 normalPopulation, uint256 normalProductivity, uint256 normalKnowledge) = _calculateUserNormalPlanetParams(
      account
    );
    (uint256 specialPopulation, uint256 specialProductivity, uint256 specialKnowledge) = _calculateUserSpecialPlanetParams(
      account
    );

    uint256 population = normalPopulation + specialPopulation;
    uint256 productivity = normalProductivity + specialProductivity;
    uint256 knowledge = normalKnowledge + specialKnowledge;

    // TODO: type
    uint256 goldPerSec = population * productivity;
    uint32 diffSec = uint32now() - userGoldRecordOf(account).confirmedAt;
    uint256 diffGold = goldPerSec * diffSec;

    if (diffGold > 0) {
      mintGold(account, uint200(diffGold));
    }

    return knowledge;
  }

  function _calculateUserNormalPlanetParams(address account)
    private
    view
    returns (uint256, uint256, uint256)
  {
    uint256 population = 0;
    uint256 productivity = 0;
    uint256 knowledge = 0;

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
      } else if (userPlanet.kind == 2) {
        productivity += rated;
      } else if (userPlanet.kind == 3) {
        knowledge += rated;
      } else {
        revert("undefined normal planet kind");
      }
    }

    return (population, productivity, knowledge);
  }

  function _calculateUserSpecialPlanetParams(address account)
    private
    view
    returns (uint256, uint256, uint256)
  {
    uint256 population = 0;
    uint256 productivity = 0;
    uint256 knowledge = 0;

    UserSpecialPlanetRecord[] memory userPlanets = userSpecialPlanetRecordsOf(account);
    UserSpecialPlanetRecord memory userPlanet;
    uint256 param;

    for (uint16 i = 0; i < userPlanets.length; i++) {
      userPlanet = userPlanets[i];

      param = uint256(10)**userPlanet.originalParamCommonLogarithm;
      if (userPlanet.kind == 1) {
        population += param;
      } else if (userPlanet.kind == 2) {
        productivity += param;
      } else if (userPlanet.kind == 3) {
        knowledge += param;
      } else {
        revert("undefined special planet kind");
      }
    }

    return (population, productivity, knowledge);
  }
}
