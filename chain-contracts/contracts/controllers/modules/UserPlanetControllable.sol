pragma solidity 0.4.24;

import "./UserNormalPlanetControllable.sol";
import "./UserSpecialPlanetControllable.sol";
import "./UserGoldControllable.sol";

contract UserPlanetControllable is UserNormalPlanetControllable, UserSpecialPlanetControllable, UserGoldControllable {
  function setupUserPlanetControllable(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdCounterPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address userSpecialPlanetIdToOwnerPermanenceAddress,
    address userGoldPermanenceAddress
  ) internal {
    setUserNormalPlanetPermanence(userNormalPlanetPermanenceAddress);
    setUserNormalPlanetIdCounterPermanence(userNormalPlanetIdCounterPermanenceAddress);
    setUserSpecialPlanetPermanence(userSpecialPlanetPermanenceAddress);
    setUserSpecialPlanetIdToOwnerPermanence(userSpecialPlanetIdToOwnerPermanenceAddress);
    setUserGoldPermanence(userGoldPermanenceAddress);
  }

  function confirm(address account) internal returns (uint) {
    uint population = 0;
    uint productivity = 0;
    uint knowledge = 0;

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
        productivity += rated;
      } else if (userPlanet.kind == 3) {
        knowledge += rated;
      } else {
        revert("undefined kind");
      }
    }

    // TODO: type
    uint goldPerSec = population * productivity;
    uint32 diffSec = uint32now() - userGoldRecordOf(account).confirmedAt;
    uint diffGold = goldPerSec * diffSec;

    if (diffGold > 0) {
      mintGold(account, uint200(diffGold));
    }

    return knowledge;
  }
}
