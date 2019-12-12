pragma solidity 0.5.13;

import "./modules/UserPlanetControllable.sol";

import "../libraries/UserPlanetMapUtil.sol";
import "../libraries/SpecialPlanetTokenIdInterpreter.sol";

import "../misc/SpecialPlanetTokenLocker.sol";
import "./HighlightedUserController.sol";

contract SpecialPlanetController is UserPlanetControllable {
  HighlightedUserController public highlightedUserController;
  SpecialPlanetTokenLocker public specialPlanetTokenLocker;

  constructor(
    address userNormalPlanetPermanenceAddress,
    address userSpecialPlanetPermanenceAddress,
    address specialPlanetIdToDataPermanenceAddress,
    address userGoldPermanenceAddress,
    address highlightedUsersContractAddress,
    address specialPlanetTokenLockerAddress
  ) public {
    setupUserPlanetControllable(
      userNormalPlanetPermanenceAddress,
      userSpecialPlanetPermanenceAddress,
      specialPlanetIdToDataPermanenceAddress,
      userGoldPermanenceAddress
    );
    highlightedUserController = HighlightedUserController(highlightedUsersContractAddress);
    specialPlanetTokenLocker = SpecialPlanetTokenLocker(specialPlanetTokenLockerAddress);
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
      int16[] memory coordinates, // [q, r, ...]
      uint64[] memory artSeeds
    )
  {
    UserGoldRecord memory goldRecord = userGoldRecordOf(account);
    confirmedGold = goldRecord.balance;
    goldConfirmedAt = goldRecord.confirmedAt;

    UserSpecialPlanetRecord[] memory userPlanetRecords = userSpecialPlanetRecordsOf(account);
    uint256 userPlanetsCount = userPlanetRecords.length;

    ids = new uint24[](userPlanetsCount);
    kinds = new uint8[](userPlanetsCount);
    paramRates = new uint8[](userPlanetsCount);
    times = new uint32[](userPlanetsCount * 2);
    coordinates = new int16[](userPlanetsCount * 2);
    artSeeds = new uint64[](userPlanetsCount);

    for (uint256 i = 0; i < userPlanetsCount; i++) {
      ids[i] = userPlanetRecords[i].id;
      kinds[i] = userPlanetRecords[i].kind;
      paramRates[i] = userPlanetRecords[i].paramRate;
      times[i * 2] = userPlanetRecords[i].rankupedAt;
      times[i * 2 + 1] = userPlanetRecords[i].createdAt;
      coordinates[i * 2] = userPlanetRecords[i].coordinateQ;
      coordinates[i * 2 + 1] = userPlanetRecords[i].coordinateR;
      artSeeds[i] = userPlanetRecords[i].artSeed;
    }
  }

  // token's approval for locker is needed before call this function
  function setPlanet(uint256 tokenId, int16 coordinateQ, int16 coordinateR) external {
    confirm(msg.sender);

    require(
      UserPlanetMapUtil.isInUsableRadius(
        coordinateQ,
        coordinateR,
        userGoldRecordOf(msg.sender).balance
      ),
      "not allowed coordinate"
    );
    revertIfCoordinatesAreUsed(
      msg.sender,
      _wrapWithArray(coordinateQ),
      _wrapWithArray(coordinateR)
    );

    _setSpecialPlanetToMap(tokenId, coordinateQ, coordinateR);

    highlightedUserController.tackle(msg.sender);
  }

  function removePlanet(uint24 shortId) external {
    confirm(msg.sender);
    _removeSpecialPlanetFromMap(shortId);
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
      (uint24 shortId, uint8 version, uint8 kind, uint8 paramRate, uint64 artSeed) = SpecialPlanetTokenIdInterpreter
        .idToFields(tokenIds[i]);

      shortIds[i] = shortId;
      versions[i] = version;
      kinds[i] = kind;
      paramRates[i] = paramRate;
      artSeeds[i] = artSeed;
    }
  }

  function _setSpecialPlanetToMap(uint256 tokenId, int16 coordinateQ, int16 coordinateR) private {
    specialPlanetTokenLocker.lock(msg.sender, tokenId);

    (uint24 shortId, uint8 version, uint8 kind, uint8 paramRate, uint64 artSeed) = SpecialPlanetTokenIdInterpreter
      .idToFields(tokenId);
    setUserSpecialPlanetToMap(
      msg.sender,
      shortId,
      version,
      kind,
      paramRate,
      artSeed,
      coordinateQ,
      coordinateR
    );
  }

  function _removeSpecialPlanetFromMap(uint24 shortId) private {
    specialPlanetTokenLocker.unlock(msg.sender, shortId);
    removeUserSpecialPlanetFromMap(msg.sender, shortId);
  }

  function _wrapWithArray(int16 value) private pure returns (int16[] memory) {
    int16[] memory arr = new int16[](1);
    arr[0] = value;
    return arr;
  }
}
