pragma solidity 0.4.24;

import "./modules/UserPlanetControllable.sol";

import "./RemarkableUserController.sol";
import "../tokens/Erc721SpecialPlanet.sol";

contract SpecialPlanetController is UserPlanetControllable {
  RemarkableUserController private _remarkableUserController;
  Erc721SpecialPlanet private _erc721SpecialPlanet;

  constructor(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdCounterPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address userSpecialPlanetIdToOwnerPermanenceAddress,
    address userGoldPermanenceAddress,
    address remarkableUsersContractAddress,
    address erc721SpecialPlanetAddress
  ) public {
    setupUserPlanetControllable(
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdCounterPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      userSpecialPlanetIdToOwnerPermanenceAddress,
      userGoldPermanenceAddress
    );
    _remarkableUserController = RemarkableUserController(remarkableUsersContractAddress);
    _erc721SpecialPlanet = Erc721SpecialPlanet(erc721SpecialPlanetAddress);
  }

  function remarkableUserController() external view returns (RemarkableUserController) {
    return _remarkableUserController;
  }

  function erc721SpecialPlanet() external view returns (Erc721SpecialPlanet) {
    return _erc721SpecialPlanet;
  }

  function planets(address account)
    external
    view
    returns (
    uint24[], // id
    uint8[], // kind
    uint8[], // originalParamCommonLogarithm
    uint32[], // [rankupedAt, createdAt, ...]
    int16[] // [q, r, ...]
  )
  {
    UserSpecialPlanetRecord[] memory userPlanetRecords = userSpecialPlanetRecordsOf(account);
    uint16 userPlanetsCount = uint16(userPlanetRecords.length);

    uint24[] memory ids = new uint24[](userPlanetsCount);
    uint8[] memory kinds = new uint8[](userPlanetsCount);
    uint8[] memory params = new uint8[](userPlanetsCount);
    uint32[] memory times = new uint32[](userPlanetsCount * 2);
    int16[] memory coordinates = new int16[](userPlanetsCount * 2);

    uint16 counter = 0;

    for (uint16 i = 0; i < userPlanetsCount; i++) {
      ids[i] = userPlanetRecords[i].id;
      kinds[i] = userPlanetRecords[i].kind;
      params[i] = userPlanetRecords[i].originalParamCommonLogarithm;
      times[counter] = userPlanetRecords[i].rankupedAt;
      times[counter + 1] = userPlanetRecords[i].createdAt;
      coordinates[counter] = userPlanetRecords[i].axialCoordinateQ;
      coordinates[counter + 1] = userPlanetRecords[i].axialCoordinateR;

      counter += 2;
    }

    return (ids, kinds, params, times, coordinates);
  }

  function getPlanet() external {
    // TODO: cost
    uint8 kind = 1; // TODO
    uint8 paramCommonLogarithm = 40; // TODO

    uint24 id = mintUserSpecialPlanet(msg.sender, kind, paramCommonLogarithm);
    // TODO
    // _erc721SpecialPlanet.mintWithTokenURI(msg.sender, id, "");
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
