pragma solidity 0.4.24;

import "./modules/UserPlanetControllable.sol";

import "./RemarkableUserController.sol";

contract SpecialPlanetController is UserPlanetControllable {
  RemarkableUserController private _remarkableUserController;

  constructor(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdCounterPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address userSpecialPlanetIdToOwnerPermanenceAddress,
    address userGoldPermanenceAddress,
    address remarkableUsersContractAddress
  ) public {
    setupUserPlanetControllable(
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdCounterPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      userSpecialPlanetIdToOwnerPermanenceAddress,
      userGoldPermanenceAddress
    );
    _remarkableUserController = RemarkableUserController(remarkableUsersContractAddress);
  }

  function remarkableUserController() external view returns (RemarkableUserController) {
    return _remarkableUserController;
  }

  function getPlanet() external {
    // TODO: cost
    uint8 kind = 1; // TODO
    uint8 paramCommonLogarithm = 40; // TODO

    mintUserSpecialPlanet(msg.sender, kind, paramCommonLogarithm);
  }

  function setPlanet(uint24 userPlanetId, int16 axialCoordinateQ, int16 axialCoordinateR) external {
    confirm(msg.sender);
    updateUserSpecialPlanetAxialCoordinates(
      msg.sender,
      userPlanetId,
      axialCoordinateQ,
      axialCoordinateR
    );
    _remarkableUserController.tackle(msg.sender);
  }

  function removePlanet(uint24 userPlanetId) external {
    confirm(msg.sender);
    updateUserSpecialPlanetAxialCoordinates(
      msg.sender,
      userPlanetId,
      AXIAL_COORDINATE_NONE,
      AXIAL_COORDINATE_NONE
    );
  }
}
