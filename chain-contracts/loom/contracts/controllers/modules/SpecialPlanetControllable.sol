pragma solidity 0.5.11;

import "./TimeGettable.sol";

import "../../permanences/UserSpecialPlanetPermanence.sol";
import "../../permanences/SpecialPlanetIdToDataPermanence.sol";

contract SpecialPlanetControllable is TimeGettable {
  UserSpecialPlanetPermanence private _userSpecialPlanetPermanence;
  SpecialPlanetIdToDataPermanence public specialPlanetIdToDataPermanence;

  int16 constant INT16_MAX = int16(~(uint16(1) << 15));
  int16 constant COORDINATE_NONE = INT16_MAX;

  struct UserSpecialPlanetRecord {
    uint24 id;
    uint8 version;
    uint8 kind;
    uint8 paramRate;
    uint8 rank;
    uint32 rankupedAt;
    uint32 createdAt;
    int16 coordinateQ;
    int16 coordinateR;
    uint64 artSeed;
  }

  uint8 constant SPECIAL_PLANET_DATA_ID_START_BIT = 0;
  uint8 constant SPECIAL_PLANET_DATA_VERSION_START_BIT = 24;
  uint8 constant SPECIAL_PLANET_DATA_KIND_START_BIT = 24 + 8;
  uint8 constant SPECIAL_PLANET_DATA_PARAM_RATE_START_BIT = 24 + 8 + 8;
  uint8 constant SPECIAL_PLANET_DATA_RANK_START_BIT = 24 + 8 + 8 + 8;
  uint8 constant SPECIAL_PLANET_DATA_RANKUPED_AT_START_BIT = 24 + 8 + 8 + 8 + 8;
  uint8 constant SPECIAL_PLANET_DATA_CREATED_AT_START_BIT = 24 + 8 + 8 + 8 + 8 + 32;
  uint8 constant SPECIAL_PLANET_DATA_COORDINATE_Q_START_BIT = 24 + 8 + 8 + 8 + 8 + 32 + 32;
  uint8 constant SPECIAL_PLANET_DATA_COORDINATE_R_START_BIT = 24 + 8 + 8 + 8 + 8 + 32 + 32 + 16;
  uint8 constant SPECIAL_PLANET_DATA_ART_SEED_START_BIT = 24 + 8 + 8 + 8 + 8 + 32 + 32 + 16 + 16;

  function userSpecialPlanetPermanence() public view returns (UserSpecialPlanetPermanence) {
    return _userSpecialPlanetPermanence;
  }

  function setUserSpecialPlanetPermanence(address addr) internal {
    _userSpecialPlanetPermanence = UserSpecialPlanetPermanence(addr);
  }

  function setSpecialPlanetIdToDataPermanence(address addr) internal {
    specialPlanetIdToDataPermanence = SpecialPlanetIdToDataPermanence(addr);
  }

  function userSpecialPlanetRecordsOf(address account)
    internal
    view
    returns (UserSpecialPlanetRecord[] memory)
  {
    bytes32[] memory us = _userSpecialPlanetPermanence.read(account);
    UserSpecialPlanetRecord[] memory records = new UserSpecialPlanetRecord[](us.length);

    for (uint16 i = 0; i < us.length; i++) {
      records[i] = buildUserSpecialPlanetRecordFromBytes32(us[i]);
    }

    return records;
  }

  function userSpecialPlanetRecordsCountOf(address account) public view returns (uint16) {
    return uint16(_userSpecialPlanetPermanence.count(account));
  }

  function userSpecialPlanetRecordOf(uint24 userPlanetId)
    internal
    view
    returns (UserSpecialPlanetRecord memory)
  {
    return
      buildUserSpecialPlanetRecordFromBytes32(specialPlanetIdToDataPermanence.read(userPlanetId));
  }

  function setUserSpecialPlanetToMap(
    address account,
    uint24 userPlanetId,
    uint8 version,
    uint8 kind,
    uint8 paramCommonLogarithm,
    uint64 artSeed,
    int16 coordinateQ,
    int16 coordinateR
  ) internal {
    bytes32 userPlanetData = specialPlanetIdToDataPermanence.read(userPlanetId);
    bytes32 newUserPlanetData;
    if (userPlanetData == bytes32(0)) {
      newUserPlanetData = buildBytes32FromUserSpecialPlanetRecord(
        UserSpecialPlanetRecord(
          userPlanetId,
          version,
          kind,
          paramCommonLogarithm,
          1,
          uint32now(),
          uint32now(),
          coordinateQ,
          coordinateR,
          artSeed
        )
      );
      specialPlanetIdToDataPermanence.update(userPlanetId, newUserPlanetData);
    } else {
      UserSpecialPlanetRecord memory r = buildUserSpecialPlanetRecordFromBytes32(userPlanetData);
      newUserPlanetData = buildBytes32FromUserSpecialPlanetRecord(
        UserSpecialPlanetRecord(
          r.id,
          r.version,
          r.kind,
          r.paramRate,
          r.rank,
          uint32now(), // rankupedAt
          r.createdAt,
          coordinateQ,
          coordinateR,
          r.artSeed
        )
      );
      specialPlanetIdToDataPermanence.update(userPlanetId, newUserPlanetData);
    }

    _userSpecialPlanetPermanence.createElement(account, newUserPlanetData);
  }

  function removeUserSpecialPlanetFromMap(address account, uint24 userPlanetId) internal {
    uint16 index;
    (, index) = _userSpecialPlanetRecordWithIndexOf(account, userPlanetId);

    _userSpecialPlanetPermanence.deleteElement(account, index);
  }

  function removeUserSpecialPlanetFromMapIfExist(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal returns (uint24[] memory) {
    UserSpecialPlanetRecord[] memory records = userSpecialPlanetRecordsOf(account);

    uint24[] memory _ids = new uint24[](coordinateQs.length);
    uint256 targetCount = 0;

    for (uint256 i = 0; i < coordinateQs.length; i++) {
      for (uint16 j = 0; j < records.length; j++) {
        if (
          coordinateQs[i] == records[j].coordinateQ && coordinateRs[i] == records[j].coordinateR
        ) {
          _ids[i] = records[j].id;
          _userSpecialPlanetPermanence.deleteElement(account, j);
          targetCount++;
          break;
        }
      }
    }

    uint24[] memory ids = new uint24[](targetCount);
    uint256 idsIndex = 0;

    for (uint256 i = 0; i < targetCount; i++) {
      if (_ids[i] != 0) {
        ids[idsIndex++] = _ids[i];
      }
    }

    return ids;
  }

  function buildUserSpecialPlanetRecordFromBytes32(bytes32 b)
    internal
    pure
    returns (UserSpecialPlanetRecord memory)
  {
    uint256 ui = uint256(b);
    return
      UserSpecialPlanetRecord(
        uint24(ui >> SPECIAL_PLANET_DATA_ID_START_BIT),
        uint8(ui >> SPECIAL_PLANET_DATA_VERSION_START_BIT),
        uint8(ui >> SPECIAL_PLANET_DATA_KIND_START_BIT),
        uint8(ui >> SPECIAL_PLANET_DATA_PARAM_RATE_START_BIT),
        uint8(ui >> SPECIAL_PLANET_DATA_RANK_START_BIT),
        uint32(ui >> SPECIAL_PLANET_DATA_RANKUPED_AT_START_BIT),
        uint32(ui >> SPECIAL_PLANET_DATA_CREATED_AT_START_BIT),
        int16(ui >> SPECIAL_PLANET_DATA_COORDINATE_Q_START_BIT),
        int16(ui >> SPECIAL_PLANET_DATA_COORDINATE_R_START_BIT),
        uint64(ui >> SPECIAL_PLANET_DATA_ART_SEED_START_BIT)
      );
  }

  function buildBytes32FromUserSpecialPlanetRecord(UserSpecialPlanetRecord memory r)
    internal
    pure
    returns (bytes32)
  {
    return
      bytes32(
        (uint256(r.id) << SPECIAL_PLANET_DATA_ID_START_BIT) |
          (uint256(r.version) << SPECIAL_PLANET_DATA_VERSION_START_BIT) |
          (uint256(r.kind) << SPECIAL_PLANET_DATA_KIND_START_BIT) |
          (uint256(r.paramRate) << SPECIAL_PLANET_DATA_PARAM_RATE_START_BIT) |
          (uint256(r.rank) << SPECIAL_PLANET_DATA_RANK_START_BIT) |
          (uint256(r.rankupedAt) << SPECIAL_PLANET_DATA_RANKUPED_AT_START_BIT) |
          (uint256(r.createdAt) << SPECIAL_PLANET_DATA_CREATED_AT_START_BIT) |
          (uint256(uint16(r.coordinateQ)) << SPECIAL_PLANET_DATA_COORDINATE_Q_START_BIT) |
          (uint256(uint16(r.coordinateR)) << SPECIAL_PLANET_DATA_COORDINATE_R_START_BIT) |
          (uint256(r.artSeed) << SPECIAL_PLANET_DATA_ART_SEED_START_BIT)
      );
  }

  function _userSpecialPlanetRecordWithIndexOf(address account, uint24 userPlanetId)
    private
    view
    returns (UserSpecialPlanetRecord memory, uint16)
  {
    bytes32[] memory us = _userSpecialPlanetPermanence.read(account);
    bytes32 target = bytes32(0);
    uint16 index;

    for (uint16 i = 0; i < us.length; i++) {
      if (uint24(uint256(us[i] >> SPECIAL_PLANET_DATA_ID_START_BIT)) == userPlanetId) {
        target = us[i];
        index = i;
        break;
      }
    }

    if (target == bytes32(0)) {
      revert("the user special planet is not found");
    }

    return (buildUserSpecialPlanetRecordFromBytes32(target), index);
  }
}
