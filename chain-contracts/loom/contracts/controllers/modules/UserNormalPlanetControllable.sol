pragma solidity 0.5.11;

import "./TimeGettable.sol";
import "../../permanences/UserNormalPlanetPermanence.sol";

contract UserNormalPlanetControllable is TimeGettable {
  struct UserNormalPlanetRecord {
    uint64 id;
    uint16 normalPlanetId;
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

  UserNormalPlanetPermanence public userNormalPlanetPermanence;

  function userNormalPlanetRecordsOf(address account)
    internal
    view
    returns (UserNormalPlanetRecord[] memory)
  {
    bytes32[] memory bArr = userNormalPlanetPermanence.read(account);
    UserNormalPlanetRecord[] memory records = new UserNormalPlanetRecord[](bArr.length);

    for (uint16 i = 0; i < bArr.length; i++) {
      records[i] = buildUserNormalPlanetRecordFromBytes32(bArr[i]);
    }

    return records;
  }

  function userNormalPlanetRecordsWithIndexesOf(address account, uint64[] memory userPlanetIds)
    internal
    view
    returns (UserNormalPlanetRecord[] memory, uint256[] memory)
  {
    UserNormalPlanetRecord[] memory records = new UserNormalPlanetRecord[](userPlanetIds.length);
    uint256[] memory indexes = new uint256[](userPlanetIds.length);

    UserNormalPlanetRecord[] memory allRecords = userNormalPlanetRecordsOf(account);

    for (uint256 i = 0; i < userPlanetIds.length; i++) {
      for (uint256 j = 0; j < allRecords.length; j++) {
        if (userPlanetIds[i] == allRecords[j].id) {
          records[i] = allRecords[j];
          indexes[i] = j;
          break;
        }
      }
    }

    return (records, indexes);
  }

  function userNormalPlanetRecordsCountOf(address account) public view returns (uint16) {
    return uint16(userNormalPlanetPermanence.count(account));
  }

  function userNormalPlanetRecordOf(address account, uint64 userPlanetId)
    internal
    view
    returns (UserNormalPlanetRecord memory)
  {
    UserNormalPlanetRecord memory record;
    (record, ) = _userNormalPlanetRecordWithIndexOf(account, userPlanetId);
    return record;
  }

  function setNormalPlanetToMap(
    address account,
    uint64 id,
    uint16 normalPlanetId,
    uint8 kind,
    uint8 paramCommonLogarithm,
    int16 coordinateQ,
    int16 coordinateR
  ) internal {
    userNormalPlanetPermanence.createElement(
      account,
      buildBytes32FromUserNormalPlanetRecord(
        UserNormalPlanetRecord(
          id,
          normalPlanetId,
          kind,
          paramCommonLogarithm,
          1,
          uint32now(),
          uint32now(),
          coordinateQ,
          coordinateR
        )
      )
    );
  }

  function rankupUserNormalPlanet(
    address account,
    UserNormalPlanetRecord memory record,
    uint256 index,
    uint8 targetRank
  ) internal {
    require(
      targetRank > record.rank && targetRank <= MAX_USER_NORMAL_PLANET_RANK,
      "invalid rank for rankup"
    );
    userNormalPlanetPermanence.updateElement(
      account,
      index,
      buildBytes32FromUserNormalPlanetRecord(
        UserNormalPlanetRecord(
          record.id,
          record.normalPlanetId,
          record.kind,
          record.originalParamCommonLogarithm,
          targetRank,
          uint32now(),
          record.createdAt,
          record.coordinateQ,
          record.coordinateR
        )
      )
    );
  }

  function removeNormalPlanetFromMap(address account, uint64 userPlanetId) internal {
    uint16 index;
    (, index) = _userNormalPlanetRecordWithIndexOf(account, userPlanetId);

    userNormalPlanetPermanence.deleteElement(account, index);
  }

  function removeUserNormalPlanetFromMapIfExist(
    address account,
    int16[] memory coordinateQs,
    int16[] memory coordinateRs
  ) internal {
    UserNormalPlanetRecord[] memory records = userNormalPlanetRecordsOf(account);

    for (uint256 i = 0; i < coordinateQs.length; i++) {
      for (uint16 j = 0; j < records.length; j++) {
        if (
          coordinateQs[i] == records[j].coordinateQ && coordinateRs[i] == records[j].coordinateR
        ) {
          userNormalPlanetPermanence.deleteElement(account, j);
          break;
        }
      }
    }
  }

  function buildUserNormalPlanetRecordFromBytes32(bytes32 b)
    internal
    pure
    returns (UserNormalPlanetRecord memory)
  {
    uint256 ui = uint256(b);

    UserNormalPlanetRecord memory record = UserNormalPlanetRecord(
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

    if (record.kind == 0) {
      revert("faild to build user normal planet, it's not created");
    }

    return record;
  }

  function buildBytes32FromUserNormalPlanetRecord(UserNormalPlanetRecord memory r)
    internal
    pure
    returns (bytes32)
  {
    return
      bytes32(
        (uint256(r.id) << _P_ID_SHIFT_COUNT) |
          (uint256(r.normalPlanetId) << _P_NORMAL_PLANET_ID_SHIFT_COUNT) |
          (uint256(r.kind) << _P_KIND_SHIFT_COUNT) |
          (uint256(r.originalParamCommonLogarithm) << _P_ORIGINAL_PARAM_SHIFT_COUNT) |
          (uint256(r.rank) << _P_RANK_SHIFT_COUNT) |
          (uint256(r.rankupedAt) << _P_RANKUPED_AT_SHIFT_COUNT) |
          (uint256(r.createdAt) << _P_CREATED_AT_SHIFT_COUNT) |
          (uint256(uint16(r.coordinateQ)) << _P_COORDINATE_Q_SHIFT_COUNT) |
          (uint256(uint16(r.coordinateR)) << _P_COORDINATE_R_SHIFT_COUNT)
      );
  }

  function _userNormalPlanetRecordWithIndexOf(address account, uint64 userPlanetId)
    private
    view
    returns (UserNormalPlanetRecord memory, uint16)
  {
    UserNormalPlanetRecord[] memory records = userNormalPlanetRecordsOf(account);

    for (uint16 i = 0; i < records.length; i++) {
      if (records[i].id == userPlanetId) {
        return (records[i], i);
      }
    }

    revert("user normal planet is not found");
  }
}
