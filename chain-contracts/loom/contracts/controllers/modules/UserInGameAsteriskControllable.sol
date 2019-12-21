pragma solidity 0.5.13;

import "../../libraries/Time.sol";

import "../../permanences/UserInGameAsteriskPermanence.sol";

contract UserInGameAsteriskControllable {
  struct UserInGameAsteriskRecord {
    uint64 id;
    uint16 inGameAsteriskId;
    uint8 kind;
    uint8 originalParamCommonLogarithm;
    uint8 rank;
    uint32 rankupedAt;
    uint32 createdAt;
    int16 coordinateQ;
    int16 coordinateR;
  }

  uint8 private constant _P_ID_SHIFT_COUNT = 0;
  uint8 private constant _P_NORMAL_PLANET_ID_SHIFT_COUNT = _P_ID_SHIFT_COUNT + 64;
  uint8 private constant _P_KIND_SHIFT_COUNT = _P_NORMAL_PLANET_ID_SHIFT_COUNT + 16;
  uint8 private constant _P_ORIGINAL_PARAM_SHIFT_COUNT = _P_KIND_SHIFT_COUNT + 8;
  uint8 private constant _P_RANK_SHIFT_COUNT = _P_ORIGINAL_PARAM_SHIFT_COUNT + 8;
  uint8 private constant _P_RANKUPED_AT_SHIFT_COUNT = _P_RANK_SHIFT_COUNT + 8;
  uint8 private constant _P_CREATED_AT_SHIFT_COUNT = _P_RANKUPED_AT_SHIFT_COUNT + 32;
  uint8 private constant _P_COORDINATE_Q_SHIFT_COUNT = _P_CREATED_AT_SHIFT_COUNT + 32;
  uint8 private constant _P_COORDINATE_R_SHIFT_COUNT = _P_COORDINATE_Q_SHIFT_COUNT + 16;

  uint8 constant MAX_USER_NORMAL_PLANET_RANK = 30;

  UserInGameAsteriskPermanence public userInGameAsteriskPermanence;

  function userInGameAsteriskRecordsOf(address account)
    internal
    view
    returns (UserInGameAsteriskRecord[] memory)
  {
    bytes32[] memory rawRecords = userInGameAsteriskPermanence.read(account);
    UserInGameAsteriskRecord[] memory records = new UserInGameAsteriskRecord[](rawRecords.length);

    for (uint256 i = 0; i < rawRecords.length; i++) {
      records[i] = buildUserInGameAsteriskRecordFromBytes32(rawRecords[i]);
    }

    return records;
  }

  function userInGameAsteriskRecordWithIndexOf(address account, uint64 userAsteriskId)
    internal
    view
    returns (UserInGameAsteriskRecord memory, uint256)
  {
    UserInGameAsteriskRecord[] memory records = userInGameAsteriskRecordsOf(account);

    for (uint256 i = 0; i < records.length; i++) {
      if (records[i].id == userAsteriskId) {
        return (records[i], i);
      }
    }

    revert("user inGame asterisk: not found");
  }

  function userInGameAsteriskRecordsWithIndexesOf(address account, uint64[] memory userAsteriskIds)
    internal
    view
    returns (UserInGameAsteriskRecord[] memory, uint256[] memory)
  {
    UserInGameAsteriskRecord[] memory records = new UserInGameAsteriskRecord[](userAsteriskIds.length);
    uint256[] memory indexes = new uint256[](userAsteriskIds.length);

    UserInGameAsteriskRecord[] memory allRecords = userInGameAsteriskRecordsOf(account);

    uint256 counter = 0;

    for (uint256 i = 0; i < userAsteriskIds.length; i++) {
      for (uint256 j = 0; j < allRecords.length; j++) {
        if (userAsteriskIds[i] == allRecords[j].id) {
          records[i] = allRecords[j];
          indexes[i] = j;
          counter++;
          break;
        }
      }
    }

    require(userAsteriskIds.length == counter, "user inGame asterisk: not found");

    return (records, indexes);
  }

  function userInGameAsteriskRecordsCountOf(address account) internal view returns (uint256) {
    return userInGameAsteriskPermanence.count(account);
  }

  function userInGameAsteriskRecordOf(address account, uint64 userAsteriskId)
    internal
    view
    returns (UserInGameAsteriskRecord memory)
  {
    UserInGameAsteriskRecord memory record;
    (record, ) = userInGameAsteriskRecordWithIndexOf(account, userAsteriskId);
    return record;
  }

  function setInGameAsteriskToMap(
    address account,
    uint64 id,
    uint16 inGameAsteriskId,
    uint8 kind,
    uint8 paramCommonLogarithm,
    int16 coordinateQ,
    int16 coordinateR
  ) internal {
    userInGameAsteriskPermanence.createElement(
      account,
      buildBytes32FromUserInGameAsteriskRecord(
        UserInGameAsteriskRecord(
          id,
          inGameAsteriskId,
          kind,
          paramCommonLogarithm,
          1,
          Time.uint32now(),
          Time.uint32now(),
          coordinateQ,
          coordinateR
        )
      )
    );
  }

  function rankupUserInGameAsterisk(
    address account,
    UserInGameAsteriskRecord memory record,
    uint256 index,
    uint8 targetRank
  ) internal {
    userInGameAsteriskPermanence.updateElement(
      account,
      index,
      buildBytes32FromUserInGameAsteriskRecord(
        UserInGameAsteriskRecord(
          record.id,
          record.inGameAsteriskId,
          record.kind,
          record.originalParamCommonLogarithm,
          targetRank,
          Time.uint32now(),
          record.createdAt,
          record.coordinateQ,
          record.coordinateR
        )
      )
    );
  }

  function removeInGamesFromMap(address account, uint64[] memory userAsteriskIds) internal {
    for (uint256 i = 0; i < userAsteriskIds.length; i++) {
      // after the deletion, indexes change, so I re-take records
      (, uint256 index) = userInGameAsteriskRecordWithIndexOf(account, userAsteriskIds[i]);
      userInGameAsteriskPermanence.deleteElement(account, index);
    }
  }

  function revertIfCoordinatesAreUsedByInGame(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal view {
    UserInGameAsteriskRecord[] memory records = userInGameAsteriskRecordsOf(
      account,
      coordinateQs,
      coordinateRs
    );
    require(records.length < 1, "userInGameAsterisk: already used coordinates");
  }

  function userInGameAsteriskRecordsOf(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal view returns (UserInGameAsteriskRecord[] memory) {
    UserInGameAsteriskRecord[] memory allRecords = userInGameAsteriskRecordsOf(account);

    UserInGameAsteriskRecord[] memory _records = new UserInGameAsteriskRecord[](coordinateQs.length);
    uint256 counter = 0;

    for (uint256 i = 0; i < coordinateQs.length; i++) {
      for (uint256 j = 0; j < allRecords.length; j++) {
        UserInGameAsteriskRecord memory record = allRecords[j];
        if (coordinateQs[i] == record.coordinateQ && coordinateRs[i] == record.coordinateR) {
          _records[counter] = record;
          counter++;
          break;
        }
      }
    }

    UserInGameAsteriskRecord[] memory records = new UserInGameAsteriskRecord[](counter);
    for (uint256 i = 0; i < counter; i++) {
      records[i] = _records[i];
    }

    return records;
  }

  function buildUserInGameAsteriskRecordFromBytes32(bytes32 b)
    internal
    pure
    returns (UserInGameAsteriskRecord memory)
  {
    uint256 ui = uint256(b);

    UserInGameAsteriskRecord memory record = UserInGameAsteriskRecord(
      uint64(ui >> _P_ID_SHIFT_COUNT),
      uint16(ui >> _P_NORMAL_PLANET_ID_SHIFT_COUNT),
      uint8(ui >> _P_KIND_SHIFT_COUNT),
      uint8(ui >> _P_ORIGINAL_PARAM_SHIFT_COUNT),
      uint8(ui >> _P_RANK_SHIFT_COUNT),
      uint32(ui >> _P_RANKUPED_AT_SHIFT_COUNT),
      uint32(ui >> _P_CREATED_AT_SHIFT_COUNT),
      int16(ui >> _P_COORDINATE_Q_SHIFT_COUNT),
      int16(ui >> _P_COORDINATE_R_SHIFT_COUNT)
    );

    require(record.kind != 0, "faild to build user inGame asterisk, it's not created");

    return record;
  }

  function buildBytes32FromUserInGameAsteriskRecord(UserInGameAsteriskRecord memory r)
    internal
    pure
    returns (bytes32)
  {
    return
      bytes32(
        (uint256(r.id) << _P_ID_SHIFT_COUNT) |
          (uint256(r.inGameAsteriskId) << _P_NORMAL_PLANET_ID_SHIFT_COUNT) |
          (uint256(r.kind) << _P_KIND_SHIFT_COUNT) |
          (uint256(r.originalParamCommonLogarithm) << _P_ORIGINAL_PARAM_SHIFT_COUNT) |
          (uint256(r.rank) << _P_RANK_SHIFT_COUNT) |
          (uint256(r.rankupedAt) << _P_RANKUPED_AT_SHIFT_COUNT) |
          (uint256(r.createdAt) << _P_CREATED_AT_SHIFT_COUNT) |
          (uint256(uint16(r.coordinateQ)) << _P_COORDINATE_Q_SHIFT_COUNT) |
          (uint256(uint16(r.coordinateR)) << _P_COORDINATE_R_SHIFT_COUNT)
      );
  }
}
