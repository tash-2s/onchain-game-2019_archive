pragma solidity 0.5.11;

import "./modules/UserGoldControllable.sol";
import "./modules/UserNormalPlanetControllable.sol";

contract UserController is UserGoldControllable, UserNormalPlanetControllable {
  constructor(
    address userGoldPermanenceAddress,
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdGeneratorPermanenceAddress
  ) public {
    setUserGoldPermanence(userGoldPermanenceAddress);
    setUserNormalPlanetPermanence(userNormalPlanetPermanenceAddress);
    setUserNormalPlanetIdGeneratorPermanence(userNormalPlanetIdGeneratorPermanenceAddress);
  }
}
