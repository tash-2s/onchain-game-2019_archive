pragma solidity 0.5.11;

import "./PermanenceInterpretable.sol";
import "./TimeGettable.sol";
import "../../permanences/UserNormalPlanetPermanence.sol";

contract UserNormalPlanetControllable is PermanenceInterpretable, TimeGettable {
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

  uint8 constant USER_NORMAL_PLANET_PERMANENCE_ID_START_DIGIT = 1;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_ID_END_DIGIT = 20;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_NORMAL_PLANET_ID_START_DIGIT = 21;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_NORMAL_PLANET_ID_END_DIGIT = 25;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_KIND_START_DIGIT = 26;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_KIND_END_DIGIT = 28;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_ORIGINAL_PARAM_START_DIGIT = 29;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_ORIGINAL_PARAM_END_DIGIT = 31;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_RANK_START_DIGIT = 32;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_RANK_END_DIGIT = 34;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_RANKUPED_AT_START_DIGIT = 35;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_RANKUPED_AT_END_DIGIT = 44;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_CREATED_AT_START_DIGIT = 45;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_CREATED_AT_END_DIGIT = 54;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_COORDINATE_Q_START_DIGIT = 55;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_COORDINATE_Q_END_DIGIT = 59;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_COORDINATE_R_START_DIGIT = 60;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_COORDINATE_R_END_DIGIT = 64;

  uint256 constant USER_NORMAL_PLANET_PERMANENCE_ELEMENT_PLACEHOLDER = 10000000000000000000000000000000000000000000000000000000000000000000000000000; // solium-disable-line max-len

  uint8 constant MAX_USER_NORMAL_PLANET_RANK = 30;

  UserNormalPlanetPermanence private _userNormalPlanetPermanence;

  function userNormalPlanetPermanence() public view returns (UserNormalPlanetPermanence) {
    return _userNormalPlanetPermanence;
  }

  function setUserNormalPlanetPermanence(address permanenceAddress) internal {
    _userNormalPlanetPermanence = UserNormalPlanetPermanence(permanenceAddress);
  }

  function userNormalPlanetRecordsOf(address account)
    internal
    view
    returns (UserNormalPlanetRecord[] memory)
  {
    uint256[] memory us = _userNormalPlanetPermanence.read(account);
    UserNormalPlanetRecord[] memory records = new UserNormalPlanetRecord[](us.length);

    for (uint16 i = 0; i < us.length; i++) {
      records[i] = buildUserNormalPlanetRecordFromUint256(us[i]);
    }

    return records;
  }

  function userNormalPlanetRecordsCountOf(address account) public view returns (uint16) {
    return uint16(_userNormalPlanetPermanence.count(account));
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
    _userNormalPlanetPermanence.createElement(
      account,
      buildUint256FromUserNormalPlanetRecord(
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

  // this should require userPlanetRecord for performance reason
  //   => a record and its index are needed, so it's not simple than I think...
  function rankupUserNormalPlanet(address account, uint64 userPlanetId, uint8 targetRank) internal {
    UserNormalPlanetRecord memory record;
    uint16 index;
    (record, index) = _userNormalPlanetRecordWithIndexOf(account, userPlanetId);

    require(
      targetRank > record.rank && targetRank <= MAX_USER_NORMAL_PLANET_RANK,
      "invalid rank for rankup"
    );
    _userNormalPlanetPermanence.updateElement(
      account,
      index,
      buildUint256FromUserNormalPlanetRecord(
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

    _userNormalPlanetPermanence.deleteElement(account, index);
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
          _userNormalPlanetPermanence.deleteElement(account, j);
          break;
        }
      }
    }
  }

  function buildUserNormalPlanetRecordFromUint256(uint256 source)
    internal
    pure
    returns (UserNormalPlanetRecord memory)
  {
    uint64 id = uint64(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_ID_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_ID_END_DIGIT
      )
    );
    uint16 normalPlanetId = uint16(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_NORMAL_PLANET_ID_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_NORMAL_PLANET_ID_END_DIGIT
      )
    );
    uint8 kind = uint8(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_KIND_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_KIND_END_DIGIT
      )
    );
    uint8 originalParamCommonLogarithm = uint8(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_ORIGINAL_PARAM_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_ORIGINAL_PARAM_END_DIGIT
      )
    );
    uint8 rank = uint8(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_RANK_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_RANK_END_DIGIT
      )
    );
    uint32 rankupedAt = uint32(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_RANKUPED_AT_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_RANKUPED_AT_END_DIGIT
      )
    );
    uint32 createdAt = uint32(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_CREATED_AT_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_CREATED_AT_END_DIGIT
      )
    );
    int16 coordinateQ = int16(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_COORDINATE_Q_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_COORDINATE_Q_END_DIGIT
      )
    );
    int16 coordinateR = int16(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_COORDINATE_R_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_COORDINATE_R_END_DIGIT
      )
    );

    if (kind == 0) {
      revert("faild to build user normal planet, it's not created");
    }

    return
      UserNormalPlanetRecord(
        id,
        normalPlanetId,
        kind,
        originalParamCommonLogarithm,
        rank,
        rankupedAt,
        createdAt,
        coordinateQ,
        coordinateR
      );
  }

  function buildUint256FromUserNormalPlanetRecord(UserNormalPlanetRecord memory record)
    internal
    pure
    returns (uint256)
  {
    uint256 n = reinterpretPermanenceUint256(
      USER_NORMAL_PLANET_PERMANENCE_ELEMENT_PLACEHOLDER,
      USER_NORMAL_PLANET_PERMANENCE_ID_START_DIGIT,
      USER_NORMAL_PLANET_PERMANENCE_ID_END_DIGIT,
      record.id
    );
    n = reinterpretPermanenceUint256(
      n,
      USER_NORMAL_PLANET_PERMANENCE_NORMAL_PLANET_ID_START_DIGIT,
      USER_NORMAL_PLANET_PERMANENCE_NORMAL_PLANET_ID_END_DIGIT,
      record.normalPlanetId
    );
    n = reinterpretPermanenceUint256(
      n,
      USER_NORMAL_PLANET_PERMANENCE_KIND_START_DIGIT,
      USER_NORMAL_PLANET_PERMANENCE_KIND_END_DIGIT,
      record.kind
    );
    n = reinterpretPermanenceUint256(
      n,
      USER_NORMAL_PLANET_PERMANENCE_ORIGINAL_PARAM_START_DIGIT,
      USER_NORMAL_PLANET_PERMANENCE_ORIGINAL_PARAM_END_DIGIT,
      record.originalParamCommonLogarithm
    );
    n = reinterpretPermanenceUint256(
      n,
      USER_NORMAL_PLANET_PERMANENCE_RANK_START_DIGIT,
      USER_NORMAL_PLANET_PERMANENCE_RANK_END_DIGIT,
      record.rank
    );
    n = reinterpretPermanenceUint256(
      n,
      USER_NORMAL_PLANET_PERMANENCE_RANKUPED_AT_START_DIGIT,
      USER_NORMAL_PLANET_PERMANENCE_RANKUPED_AT_END_DIGIT,
      record.rankupedAt
    );
    n = reinterpretPermanenceUint256(
      n,
      USER_NORMAL_PLANET_PERMANENCE_CREATED_AT_START_DIGIT,
      USER_NORMAL_PLANET_PERMANENCE_CREATED_AT_END_DIGIT,
      record.createdAt
    );
    n = reinterpretPermanenceUint256(
      n,
      USER_NORMAL_PLANET_PERMANENCE_COORDINATE_Q_START_DIGIT,
      USER_NORMAL_PLANET_PERMANENCE_COORDINATE_Q_END_DIGIT,
      uint16(record.coordinateQ)
    );
    return
      reinterpretPermanenceUint256(
        n,
        USER_NORMAL_PLANET_PERMANENCE_COORDINATE_R_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_COORDINATE_R_END_DIGIT,
        uint16(record.coordinateR)
      );
  }

  function _userNormalPlanetRecordWithIndexOf(address account, uint64 userPlanetId)
    private
    view
    returns (UserNormalPlanetRecord memory, uint16)
  {
    uint256[] memory us = _userNormalPlanetPermanence.read(account);
    uint256 target = 0;
    uint16 index;

    for (uint16 i = 0; i < us.length; i++) {
      if (
        uint64(
          interpretPermanenceUint256(
            us[i],
            USER_NORMAL_PLANET_PERMANENCE_ID_START_DIGIT,
            USER_NORMAL_PLANET_PERMANENCE_ID_END_DIGIT
          )
        ) ==
        userPlanetId
      ) {
        target = us[i];
        index = i;
        break;
      }
    }

    if (target == 0) {
      revert("user normal planet is not found");
    }

    return (buildUserNormalPlanetRecordFromUint256(target), index);
  }
}
