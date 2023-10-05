pragma solidity 0.5.13;

import "../../libraries/Time.sol";

import "../../permanences/UserTradableAsteriskPermanence.sol";
import "../../permanences/TradableAsteriskIdToDataPermanence.sol";

contract TradableAsteriskControllable {
  UserTradableAsteriskPermanence public userTradableAsteriskPermanence;
  TradableAsteriskIdToDataPermanence public tradableAsteriskIdToDataPermanence;

  struct UserTradableAsteriskRecord {
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

  function userTradableAsteriskRecordsOf(address account)
    internal
    view
    returns (UserTradableAsteriskRecord[] memory)
  {
    bytes32[] memory rawRecords = userTradableAsteriskPermanence.read(account);
    UserTradableAsteriskRecord[] memory records = new UserTradableAsteriskRecord[](
      rawRecords.length
    );

    for (uint256 i = 0; i < rawRecords.length; i++) {
      records[i] = buildUserTradableAsteriskRecordFromBytes32(rawRecords[i]);
    }

    return records;
  }

  function userTradableAsteriskRecordOf(uint24 userAsteriskId)
    internal
    view
    returns (UserTradableAsteriskRecord memory)
  {
    return
      buildUserTradableAsteriskRecordFromBytes32(
        tradableAsteriskIdToDataPermanence.read(userAsteriskId)
      );
  }

  function setUserTradableAsteriskToMap(
    address account,
    uint24 userAsteriskId,
    uint8 version,
    uint8 kind,
    uint8 paramCommonLogarithm,
    uint64 artSeed,
    int16 coordinateQ,
    int16 coordinateR
  ) internal {
    bytes32 userAsteriskData = tradableAsteriskIdToDataPermanence.read(userAsteriskId);
    bytes32 newUserAsteriskData;
    if (userAsteriskData == bytes32(0)) {
      newUserAsteriskData = buildBytes32FromUserTradableAsteriskRecord(
        UserTradableAsteriskRecord(
          userAsteriskId,
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
      tradableAsteriskIdToDataPermanence.update(userAsteriskId, newUserAsteriskData);
    } else {
      UserTradableAsteriskRecord memory r = buildUserTradableAsteriskRecordFromBytes32(
        userAsteriskData
      );
      newUserAsteriskData = buildBytes32FromUserTradableAsteriskRecord(
        UserTradableAsteriskRecord(
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
      tradableAsteriskIdToDataPermanence.update(userAsteriskId, newUserAsteriskData);
    }

    userTradableAsteriskPermanence.createElement(account, newUserAsteriskData);
  }

  function removeUserTradableAsteriskFromMap(address account, uint24 userAsteriskId) internal {
    uint256 index;
    (, index) = _userTradableAsteriskRecordWithIndexOf(account, userAsteriskId);

    userTradableAsteriskPermanence.deleteElement(account, index);
  }

  function revertIfCoordinatesAreUsedByTradable(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal view {
    UserTradableAsteriskRecord[] memory records = userTradableAsteriskRecordsOf(
      account,
      coordinateQs,
      coordinateRs
    );
    require(records.length < 1, "userTradableAsterisk: already used coordinates");
  }

  function userTradableAsteriskRecordsOf(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal view returns (UserTradableAsteriskRecord[] memory) {
    UserTradableAsteriskRecord[] memory allRecords = userTradableAsteriskRecordsOf(account);

    UserTradableAsteriskRecord[] memory _records = new UserTradableAsteriskRecord[](
      coordinateQs.length
    );
    uint256 counter = 0;

    for (uint256 i = 0; i < coordinateQs.length; i++) {
      for (uint256 j = 0; j < allRecords.length; j++) {
        UserTradableAsteriskRecord memory record = allRecords[j];
        if (coordinateQs[i] == record.coordinateQ && coordinateRs[i] == record.coordinateR) {
          _records[counter] = record;
          counter++;
          break;
        }
      }
    }

    UserTradableAsteriskRecord[] memory records = new UserTradableAsteriskRecord[](counter);

    for (uint256 i = 0; i < counter; i++) {
      records[i] = _records[i];
    }

    return records;
  }

  function buildUserTradableAsteriskRecordFromBytes32(bytes32 b)
    internal
    pure
    returns (UserTradableAsteriskRecord memory)
  {
    uint256 ui = uint256(b);
    return
      UserTradableAsteriskRecord(
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

  function buildBytes32FromUserTradableAsteriskRecord(UserTradableAsteriskRecord memory r)
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

  function _userTradableAsteriskRecordWithIndexOf(address account, uint24 userAsteriskId)
    private
    view
    returns (UserTradableAsteriskRecord memory, uint256)
  {
    bytes32[] memory rawUserAsterisks = userTradableAsteriskPermanence.read(account);
    bytes32 rawUserAsterisk = bytes32(0);
    uint256 index;

    for (uint256 i = 0; i < rawUserAsterisks.length; i++) {
      if (uint24(uint256(rawUserAsterisks[i] >> _P_ID_SHIFT_COUNT)) == userAsteriskId) {
        rawUserAsterisk = rawUserAsterisks[i];
        index = i;
        break;
      }
    }

    require(rawUserAsterisk != bytes32(0), "the user tradable asterisk is not found");

    return (buildUserTradableAsteriskRecordFromBytes32(rawUserAsterisk), index);
  }
}
