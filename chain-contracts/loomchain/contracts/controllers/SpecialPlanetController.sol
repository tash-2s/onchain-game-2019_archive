pragma solidity 0.5.11;

import "./modules/UserPlanetControllable.sol";

import "./RemarkableUserController.sol";
import "../tokens/SpecialPlanetToken.sol";
import "../misc/SpecialPlanetTokenLocker.sol";

contract SpecialPlanetController is UserPlanetControllable {
  RemarkableUserController private _remarkableUserController;
  SpecialPlanetToken private _specialPlanetToken;
  SpecialPlanetTokenLocker public specialPlanetTokenLocker;

  constructor(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdCounterPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address specialPlanetIdToDataPermanenceAddress,
    address userGoldPermanenceAddress,
    address remarkableUsersContractAddress,
    address specialPlanetTokenAddress,
    address specialPlanetTokenLockerAddress
  ) public {
    setupUserPlanetControllable(
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdCounterPermanenceAddress,
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

  function setPlanet(uint256 tokenId, int16 axialCoordinateQ, int16 axialCoordinateR) external {
    confirm(msg.sender);
    (uint24 shortId, uint8 version, uint8 kind, uint8 originalParamCommonLogarithm, uint64 artSeed) = _transferTokenToLocker(
      tokenId
    );
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
    specialPlanetTokenLocker.withdrawByShortId(shortId, msg.sender);
  }

  function _transferTokenToLocker(uint256 tokenId)
    private
    returns (uint24, uint8, uint8, uint8, uint64)
  {
    _specialPlanetToken.safeTransferFrom(msg.sender, address(specialPlanetTokenLocker), tokenId);
    return specialPlanetTokenLocker.mapShortIdToTokenIdAndParseTokenId(tokenId);
  }
}
