pragma solidity 0.5.13;

import "../../libraries/Time.sol";

import "../../permanences/UserSpecialPlanetPermanence.sol";
import "../../permanences/SpecialPlanetIdToDataPermanence.sol";

contract SpecialPlanetControllable {
  UserSpecialPlanetPermanence public userSpecialPlanetPermanence;
  SpecialPlanetIdToDataPermanence public specialPlanetIdToDataPermanence;

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

  uint8 private constant _P_ID_SHIFT_COUNT = 0;
  uint8 private constant _P_VERSION_SHIFT_COUNT = _P_ID_SHIFT_COUNT + 24;
  uint8 private constant _P_KIND_SHIFT_COUNT = _P_VERSION_SHIFT_COUNT + 8;
  uint8 private constant _P_PARAM_RATE_SHIFT_COUNT = _P_KIND_SHIFT_COUNT + 8;
  uint8 private constant _P_RANK_SHIFT_COUNT = _P_PARAM_RATE_SHIFT_COUNT + 8;
  uint8 private constant _P_RANKUPED_AT_SHIFT_COUNT = _P_RANK_SHIFT_COUNT + 8;
  uint8 private constant _P_CREATED_AT_SHIFT_COUNT = _P_RANKUPED_AT_SHIFT_COUNT + 32;
  uint8 private constant _P_COORDINATE_Q_SHIFT_COUNT = _P_CREATED_AT_SHIFT_COUNT + 32;
  uint8 private constant _P_COORDINATE_R_SHIFT_COUNT = _P_COORDINATE_Q_SHIFT_COUNT + 16;
  uint8 private constant _P_ART_SEED_SHIFT_COUNT = _P_COORDINATE_R_SHIFT_COUNT + 16;

  function userSpecialPlanetRecordsOf(address account)
    internal
    view
    returns (UserSpecialPlanetRecord[] memory)
  {
    bytes32[] memory rawRecords = userSpecialPlanetPermanence.read(account);
    UserSpecialPlanetRecord[] memory records = new UserSpecialPlanetRecord[](rawRecords.length);

    for (uint256 i = 0; i < rawRecords.length; i++) {
      records[i] = buildUserSpecialPlanetRecordFromBytes32(rawRecords[i]);
    }

    return records;
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
          Time.uint32now(),
          Time.uint32now(),
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
          Time.uint32now(), // rankupedAt
          r.createdAt,
          coordinateQ,
          coordinateR,
          r.artSeed
        )
      );
      specialPlanetIdToDataPermanence.update(userPlanetId, newUserPlanetData);
    }

    userSpecialPlanetPermanence.createElement(account, newUserPlanetData);
  }

  function removeUserSpecialPlanetFromMap(address account, uint24 userPlanetId) internal {
    uint256 index;
    (, index) = _userSpecialPlanetRecordWithIndexOf(account, userPlanetId);

    userSpecialPlanetPermanence.deleteElement(account, index);
  }

  function revertIfCoordinatesAreUsedBySpecial(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal view {
    UserSpecialPlanetRecord[] memory records = userSpecialPlanetRecordsOf(
      account,
      coordinateQs,
      coordinateRs
    );
    require(records.length < 1, "userSpecialPlanet: already used coordinates");
  }

  function userSpecialPlanetRecordsOf(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal view returns (UserSpecialPlanetRecord[] memory) {
    UserSpecialPlanetRecord[] memory allRecords = userSpecialPlanetRecordsOf(account);

    UserSpecialPlanetRecord[] memory _records = new UserSpecialPlanetRecord[](coordinateQs.length);
    uint256 counter = 0;

    for (uint256 i = 0; i < coordinateQs.length; i++) {
      for (uint256 j = 0; j < allRecords.length; j++) {
        UserSpecialPlanetRecord memory record = allRecords[j];
        if (coordinateQs[i] == record.coordinateQ && coordinateRs[i] == record.coordinateR) {
          _records[counter] = record;
          counter++;
          break;
        }
      }
    }

    UserSpecialPlanetRecord[] memory records = new UserSpecialPlanetRecord[](counter);

    for (uint256 i = 0; i < counter; i++) {
      records[i] = _records[i];
    }

    return records;
  }

  function buildUserSpecialPlanetRecordFromBytes32(bytes32 b)
    internal
    pure
    returns (UserSpecialPlanetRecord memory)
  {
    uint256 ui = uint256(b);
    return
      UserSpecialPlanetRecord(
        uint24(ui >> _P_ID_SHIFT_COUNT),
        uint8(ui >> _P_VERSION_SHIFT_COUNT),
        uint8(ui >> _P_KIND_SHIFT_COUNT),
        uint8(ui >> _P_PARAM_RATE_SHIFT_COUNT),
        uint8(ui >> _P_RANK_SHIFT_COUNT),
        uint32(ui >> _P_RANKUPED_AT_SHIFT_COUNT),
        uint32(ui >> _P_CREATED_AT_SHIFT_COUNT),
        int16(ui >> _P_COORDINATE_Q_SHIFT_COUNT),
        int16(ui >> _P_COORDINATE_R_SHIFT_COUNT),
        uint64(ui >> _P_ART_SEED_SHIFT_COUNT)
      );
  }

  function buildBytes32FromUserSpecialPlanetRecord(UserSpecialPlanetRecord memory r)
    internal
    pure
    returns (bytes32)
  {
    return
      bytes32(
        (uint256(r.id) << _P_ID_SHIFT_COUNT) |
          (uint256(r.version) << _P_VERSION_SHIFT_COUNT) |
          (uint256(r.kind) << _P_KIND_SHIFT_COUNT) |
          (uint256(r.paramRate) << _P_PARAM_RATE_SHIFT_COUNT) |
          (uint256(r.rank) << _P_RANK_SHIFT_COUNT) |
          (uint256(r.rankupedAt) << _P_RANKUPED_AT_SHIFT_COUNT) |
          (uint256(r.createdAt) << _P_CREATED_AT_SHIFT_COUNT) |
          (uint256(uint16(r.coordinateQ)) << _P_COORDINATE_Q_SHIFT_COUNT) |
          (uint256(uint16(r.coordinateR)) << _P_COORDINATE_R_SHIFT_COUNT) |
          (uint256(r.artSeed) << _P_ART_SEED_SHIFT_COUNT)
      );
  }

  function _userSpecialPlanetRecordWithIndexOf(address account, uint24 userPlanetId)
    private
    view
    returns (UserSpecialPlanetRecord memory, uint256)
  {
    bytes32[] memory rawUserPlanets = userSpecialPlanetPermanence.read(account);
    bytes32 rawUserPlanet = bytes32(0);
    uint256 index;

    for (uint256 i = 0; i < rawUserPlanets.length; i++) {
      if (uint24(uint256(rawUserPlanets[i] >> _P_ID_SHIFT_COUNT)) == userPlanetId) {
        rawUserPlanet = rawUserPlanets[i];
        index = i;
        break;
      }
    }

    require(rawUserPlanet != bytes32(0), "the user special planet is not found");

    return (buildUserSpecialPlanetRecordFromBytes32(rawUserPlanet), index);
  }
}
