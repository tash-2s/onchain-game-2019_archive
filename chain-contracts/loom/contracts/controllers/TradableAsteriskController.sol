pragma solidity 0.5.13;

import "./modules/UserAsteriskControllable.sol";

import "../libraries/UserAsteriskMapUtil.sol";
import "../libraries/TradableAsteriskTokenIdInterpreter.sol";

import "../misc/TradableAsteriskTokenLocker.sol";
import "./HighlightedUserController.sol";

contract TradableAsteriskController is UserAsteriskControllable {
  HighlightedUserController public highlightedUserController;
  TradableAsteriskTokenLocker public tradableAsteriskTokenLocker;

  constructor(
    address userInGameAsteriskPermanenceAddress,
    address userTradableAsteriskPermanenceAddress,
    address tradableAsteriskIdToDataPermanenceAddress,
    address userGoldPermanenceAddress,
    address highlightedUsersControllerAddress,
    address tradableAsteriskTokenLockerAddress
  ) public {
    setupUserAsteriskControllable(
      userInGameAsteriskPermanenceAddress,
      userTradableAsteriskPermanenceAddress,
      tradableAsteriskIdToDataPermanenceAddress,
      userGoldPermanenceAddress
    );
    highlightedUserController = HighlightedUserController(highlightedUsersControllerAddress);
    tradableAsteriskTokenLocker = TradableAsteriskTokenLocker(tradableAsteriskTokenLockerAddress);
  }

  function getAsterisks(address account)
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

    UserTradableAsteriskRecord[] memory userAsteriskRecords = userTradableAsteriskRecordsOf(account);
    uint256 userAsterisksCount = userAsteriskRecords.length;

    ids = new uint24[](userAsterisksCount);
    kinds = new uint8[](userAsterisksCount);
    paramRates = new uint8[](userAsterisksCount);
    times = new uint32[](userAsterisksCount * 2);
    coordinates = new int16[](userAsterisksCount * 2);
    artSeeds = new uint64[](userAsterisksCount);

    for (uint256 i = 0; i < userAsterisksCount; i++) {
      ids[i] = userAsteriskRecords[i].id;
      kinds[i] = userAsteriskRecords[i].kind;
      paramRates[i] = userAsteriskRecords[i].paramRate;
      times[i * 2] = userAsteriskRecords[i].rankupedAt;
      times[i * 2 + 1] = userAsteriskRecords[i].createdAt;
      coordinates[i * 2] = userAsteriskRecords[i].coordinateQ;
      coordinates[i * 2 + 1] = userAsteriskRecords[i].coordinateR;
      artSeeds[i] = userAsteriskRecords[i].artSeed;
    }
  }

  // token's approval for locker is needed before call this function
  function setAsterisk(uint256 tokenId, int16 coordinateQ, int16 coordinateR) external {
    confirm(msg.sender);

    require(
      UserAsteriskMapUtil.isInUsableRadius(
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

    _setTradableAsteriskToMap(tokenId, coordinateQ, coordinateR);

    highlightedUserController.tackle(msg.sender);
  }

  function removeAsterisk(uint24 shortId) external {
    confirm(msg.sender);
    _removeTradableAsteriskFromMap(shortId);
  }

  function getAsteriskFieldsFromTokenIds(uint256[] calldata tokenIds)
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
      (uint24 shortId, uint8 version, uint8 kind, uint8 paramRate, uint64 artSeed) = TradableAsteriskTokenIdInterpreter
        .idToFields(tokenIds[i]);

      shortIds[i] = shortId;
      versions[i] = version;
      kinds[i] = kind;
      paramRates[i] = paramRate;
      artSeeds[i] = artSeed;
    }
  }

  function _setTradableAsteriskToMap(uint256 tokenId, int16 coordinateQ, int16 coordinateR) private {
    tradableAsteriskTokenLocker.lock(msg.sender, tokenId);

    (uint24 shortId, uint8 version, uint8 kind, uint8 paramRate, uint64 artSeed) = TradableAsteriskTokenIdInterpreter
      .idToFields(tokenId);
    setUserTradableAsteriskToMap(
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

  function _removeTradableAsteriskFromMap(uint24 shortId) private {
    tradableAsteriskTokenLocker.unlock(msg.sender, shortId);
    removeUserTradableAsteriskFromMap(msg.sender, shortId);
  }

  function _wrapWithArray(int16 value) private pure returns (int16[] memory) {
    int16[] memory arr = new int16[](1);
    arr[0] = value;
    return arr;
  }
}
