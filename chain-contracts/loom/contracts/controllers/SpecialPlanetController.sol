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

  function getPlanets(address account)
    external
    view
    returns (
      uint200 confirmedGold,
      uint32 goldConfirmedAt,
      uint24[] memory ids, // id
      uint8[] memory kinds, // kind
      uint8[] memory originalParamCommonLogarithms, // originalParamCommonLogarithm
      uint32[] memory times, // [rankupedAt, createdAt, ...]
      int16[] memory axialCoordinates, // [q, r, ...]
      uint64[] memory artSeeds
    )
  {
    UserGoldRecord memory goldRecord = userGoldRecordOf(account);
    confirmedGold = goldRecord.balance;
    goldConfirmedAt = goldRecord.confirmedAt;

    UserSpecialPlanetRecord[] memory userPlanetRecords = userSpecialPlanetRecordsOf(account);
    uint16 userPlanetsCount = uint16(userPlanetRecords.length);

    ids = new uint24[](userPlanetsCount);
    kinds = new uint8[](userPlanetsCount);
    originalParamCommonLogarithms = new uint8[](userPlanetsCount);
    times = new uint32[](userPlanetsCount * 2);
    axialCoordinates = new int16[](userPlanetsCount * 2);
    artSeeds = new uint64[](userPlanetsCount);

    uint16 counter = 0;

    for (uint16 i = 0; i < userPlanetsCount; i++) {
      ids[i] = userPlanetRecords[i].id;
      kinds[i] = userPlanetRecords[i].kind;
      originalParamCommonLogarithms[i] = userPlanetRecords[i].originalParamCommonLogarithm;
      times[counter] = userPlanetRecords[i].rankupedAt;
      times[counter + 1] = userPlanetRecords[i].createdAt;
      axialCoordinates[counter] = userPlanetRecords[i].axialCoordinateQ;
      axialCoordinates[counter + 1] = userPlanetRecords[i].axialCoordinateR;
      artSeeds[i] = userPlanetRecords[i].artSeed;

      counter += 2;
    }
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

  function getPlanetFieldsFromTokenIds(uint256[] calldata tokenIds)
    external
    pure
    returns (
      uint24[] memory shortIds,
      uint8[] memory versions,
      uint8[] memory kinds,
      uint8[] memory originalParamCommonLogarithms,
      uint64[] memory artSeeds
    )
  {
    uint256 size = tokenIds.length;

    shortIds = new uint24[](size);
    versions = new uint8[](size);
    kinds = new uint8[](size);
    originalParamCommonLogarithms = new uint8[](size);
    artSeeds = new uint64[](size);

    for (uint256 i = 0; i < size; i++) {
      (uint24 shortId, uint8 version, uint8 kind, uint8 originalParamCommonLogarithm, uint64 artSeed) = interpretSpecialPlanetTokenIdToFields(
        tokenIds[i]
      );

      shortIds[i] = shortId;
      versions[i] = version;
      kinds[i] = kind;
      originalParamCommonLogarithms[i] = originalParamCommonLogarithm;
      artSeeds[i] = artSeed;
    }
  }

  function _transferTokenToLocker(uint256 tokenId, uint24 shortId) private {
    _specialPlanetToken.safeTransferFrom(msg.sender, address(specialPlanetTokenLocker), tokenId);
    specialPlanetTokenLocker.setup(msg.sender, tokenId, shortId);
  }
}
