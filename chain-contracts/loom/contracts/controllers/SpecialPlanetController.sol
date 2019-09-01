pragma solidity 0.5.11;

import "./modules/UserPlanetControllable.sol";

import "./RemarkableUserController.sol";
import "../tokens/SpecialPlanetToken.sol";
import "../misc/SpecialPlanetTokenLocker.sol";

import "../../../SpecialPlanetTokenIdInterpretable.sol";

contract SpecialPlanetController is UserPlanetControllable, SpecialPlanetTokenIdInterpretable {
  RemarkableUserController private _remarkableUserController;
  SpecialPlanetToken private _specialPlanetToken;
  SpecialPlanetTokenLocker public specialPlanetTokenLocker;

  constructor(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdGeneratorPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address specialPlanetIdToDataPermanenceAddress,
    address userGoldPermanenceAddress,
    address remarkableUsersContractAddress,
    address specialPlanetTokenAddress,
    address specialPlanetTokenLockerAddress
  ) public {
    setupUserPlanetControllable(
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdGeneratorPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      specialPlanetIdToDataPermanenceAddress,
      userGoldPermanenceAddress
    );
    _remarkableUserController = RemarkableUserController(remarkableUsersContractAddress);
    _specialPlanetToken = SpecialPlanetToken(specialPlanetTokenAddress);
    specialPlanetTokenLocker = SpecialPlanetTokenLocker(specialPlanetTokenLockerAddress);
  }

  function remarkableUserController() external view returns (RemarkableUserController) {
    return _remarkableUserController;
  }

  function specialPlanetToken() external view returns (SpecialPlanetToken) {
    return _specialPlanetToken;
  }

  function planets(address account)
    external
    view
    returns (
      uint24[] memory, // id
      uint8[] memory, // kind
      uint8[] memory, // originalParamCommonLogarithm
      uint32[] memory, // [rankupedAt, createdAt, ...]
      int16[] memory // [q, r, ...]
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

  // sender needs to approve the transfer of this token before call this function
  function setPlanet(uint256 tokenId, int16 axialCoordinateQ, int16 axialCoordinateR) external {
    confirm(msg.sender);
    (uint24 shortId, uint8 version, uint8 kind, uint8 originalParamCommonLogarithm, uint64 artSeed) = interpretSpecialPlanetTokenIdToFields(
      tokenId
    );
    _transferTokenToLocker(tokenId, shortId);
    setUserSpecialPlanetToMap(
      msg.sender,
      shortId,
      version,
      kind,
      originalParamCommonLogarithm,
      artSeed,
      axialCoordinateQ,
      axialCoordinateR
    );
    _remarkableUserController.tackle(msg.sender);
  }

  function removePlanet(uint24 shortId) external {
    confirm(msg.sender);
    removeUserSpecialPlanetFromMap(msg.sender, shortId);
    specialPlanetTokenLocker.withdraw(shortId);
  }

  function getPlanetFieldsFromTokenId(uint256 tokenId)
    external
    pure
    returns (uint24, uint8, uint8, uint8, uint64)
  {
    return interpretSpecialPlanetTokenIdToFields(tokenId);
  }

  function _transferTokenToLocker(uint256 tokenId, uint24 shortId) private {
    _specialPlanetToken.safeTransferFrom(msg.sender, address(specialPlanetTokenLocker), tokenId);
    specialPlanetTokenLocker.setup(msg.sender, tokenId, shortId);
  }
}
