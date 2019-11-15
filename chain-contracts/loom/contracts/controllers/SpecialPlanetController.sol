pragma solidity 0.5.11;

import "./modules/UserPlanetControllable.sol";
import "../../../SpecialPlanetTokenIdInterpretable.sol";

import "./HighlightedUserController.sol";

contract SpecialPlanetController is UserPlanetControllable, SpecialPlanetTokenIdInterpretable {
  HighlightedUserController private _highlightedUserController;

  constructor(
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdGeneratorPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address specialPlanetIdToDataPermanenceAddress,
    address userGoldPermanenceAddress,
    address highlightedUsersContractAddress,
    address specialPlanetTokenLockerAddress
  ) public {
    setupUserPlanetControllable(
      userNormalPlanetPermanenceAddress,
      userNormalPlanetIdGeneratorPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      specialPlanetIdToDataPermanenceAddress,
      userGoldPermanenceAddress,
      specialPlanetTokenLockerAddress
    );
    _highlightedUserController = HighlightedUserController(highlightedUsersContractAddress);
  }

  function highlightedUserController() external view returns (HighlightedUserController) {
    return _highlightedUserController;
  }

  function getPlanets(address account)
    external
    view
    returns (
      uint200 confirmedGold,
      uint32 goldConfirmedAt,
      uint24[] memory ids,
      uint8[] memory kinds,
      uint8[] memory paramRates,
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
    paramRates = new uint8[](userPlanetsCount);
    times = new uint32[](userPlanetsCount * 2);
    axialCoordinates = new int16[](userPlanetsCount * 2);
    artSeeds = new uint64[](userPlanetsCount);

    uint16 counter = 0;

    for (uint16 i = 0; i < userPlanetsCount; i++) {
      ids[i] = userPlanetRecords[i].id;
      kinds[i] = userPlanetRecords[i].kind;
      paramRates[i] = userPlanetRecords[i].paramRate;
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
    (uint24 shortId, uint8 version, uint8 kind, uint8 paramRate, uint64 artSeed) = interpretSpecialPlanetTokenIdToFields(
      tokenId
    );
    _transferTokenToLocker(tokenId, shortId);
    setUserSpecialPlanetToMap(
      msg.sender,
      shortId,
      version,
      kind,
      paramRate,
      artSeed,
      axialCoordinateQ,
      axialCoordinateR
    );
    _highlightedUserController.tackle(msg.sender);
  }

  function removePlanet(uint24 shortId) external {
    confirm(msg.sender);
    removeSpecialPlanetFromMap(msg.sender, shortId);
  }

  function getPlanetFieldsFromTokenIds(uint256[] calldata tokenIds)
    external
    pure
    returns (
      uint24[] memory shortIds,
      uint8[] memory versions,
      uint8[] memory kinds,
      uint8[] memory paramRates,
      uint64[] memory artSeeds
    )
  {
    uint256 size = tokenIds.length;

    shortIds = new uint24[](size);
    versions = new uint8[](size);
    kinds = new uint8[](size);
    paramRates = new uint8[](size);
    artSeeds = new uint64[](size);

    for (uint256 i = 0; i < size; i++) {
      (uint24 shortId, uint8 version, uint8 kind, uint8 paramRate, uint64 artSeed) = interpretSpecialPlanetTokenIdToFields(
        tokenIds[i]
      );

      shortIds[i] = shortId;
      versions[i] = version;
      kinds[i] = kind;
      paramRates[i] = paramRate;
      artSeeds[i] = artSeed;
    }
  }

  function _transferTokenToLocker(uint256 tokenId, uint24 shortId) private {
    specialPlanetTokenLocker.specialPlanetToken().safeTransferFrom(msg.sender, address(specialPlanetTokenLocker), tokenId);
    specialPlanetTokenLocker.setup(msg.sender, tokenId, shortId);
  }
}
