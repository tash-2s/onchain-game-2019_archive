pragma solidity 0.4.24;

import "./PermanenceInterpretable.sol";
import "./TimeGettable.sol";
import "../../permanences/UserNormalPlanetPermanence.sol";
import "../../permanences/UserNormalPlanetIdCounterPermanence.sol";

contract UserNormalPlanetControllable is PermanenceInterpretable, TimeGettable {
  struct UserNormalPlanetRecord {
    uint16 id;
    uint16 normalPlanetId;
    uint8 kind;
    uint16 originalParam;
    uint8 rank;
    uint32 rankupedAt;
    uint32 createdAt;
    int16 axialCoordinateQ;
    int16 axialCoordinateR;
  }

  uint8 constant USER_NORMAL_PLANET_PERMANENCE_ID_START_DIGIT = 1;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_ID_END_DIGIT = 5;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_NORMAL_PLANET_ID_START_DIGIT = 6;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_NORMAL_PLANET_ID_END_DIGIT = 10;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_KIND_START_DIGIT = 11;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_KIND_END_DIGIT = 13;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_ORIGINAL_PARAM_START_DIGIT = 14;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_ORIGINAL_PARAM_END_DIGIT = 18;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_RANK_START_DIGIT = 19;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_RANK_END_DIGIT = 21;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_RANKUPED_AT_START_DIGIT = 22;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_RANKUPED_AT_END_DIGIT = 31;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_CREATED_AT_START_DIGIT = 32;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_CREATED_AT_END_DIGIT = 41;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_Q_START_DIGIT = 42;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_Q_END_DIGIT = 46;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_R_START_DIGIT = 47;
  uint8 constant USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_R_END_DIGIT = 51;

  uint256 constant USER_NORMAL_PLANET_PERMANENCE_ELEMENT_PLACEHOLDER = 10000000000000000000000000000000000000000000000000000000000000000000000000000; // solium-disable-line max-len

  UserNormalPlanetPermanence private _userNormalPlanetPermanence;
  UserNormalPlanetIdCounterPermanence private _userNormalPlanetIdCounterPermanence;

  function userNormalPlanetPermanence() public view returns (UserNormalPlanetPermanence) {
    return _userNormalPlanetPermanence;
  }

  function setUserNormalPlanetPermanence(address permanenceAddress) internal {
    _userNormalPlanetPermanence = UserNormalPlanetPermanence(permanenceAddress);
  }

  function userNormalPlanetIdCounterPermanence()
    public
    view
    returns (UserNormalPlanetIdCounterPermanence)
  {
    return _userNormalPlanetIdCounterPermanence;
  }

  function setUserNormalPlanetIdCounterPermanence(address permanenceAddress) internal {
    _userNormalPlanetIdCounterPermanence = UserNormalPlanetIdCounterPermanence(permanenceAddress);
  }

  function userNormalPlanetRecordsOf(address account)
    internal
    view
    returns (UserNormalPlanetRecord[])
  {
    uint256[] memory us = _userNormalPlanetPermanence.read(account);
    UserNormalPlanetRecord[] memory records = new UserNormalPlanetRecord[](us.length);

    for (uint16 i = 0; i < us.length; i++) {
      records[i] = buildUserNormalPlanetRecordFromUint256(us[i]);
    }

    return records;
  }

  function userNormalPlanetRecordsCountOf(address account) public view returns (uint256) {
    return _userNormalPlanetPermanence.arrayLength(account);
  }

  function userNormalPlanetRecordOf(address account, uint16 userPlanetId)
    internal
    view
    returns (UserNormalPlanetRecord)
  {
    (uint256 target, ) = _userNormalPlanetUint256WithIndexOf(account, userPlanetId);
    return buildUserNormalPlanetRecordFromUint256(target);
  }

  function mintUserNormalPlanet(
    address account,
    uint16 normalPlanetId,
    uint8 kind,
    uint16 param,
    int16 axialCoordinateQ,
    int16 axialCoordinateR
  ) internal {
    UserNormalPlanetRecord[] memory records = userNormalPlanetRecordsOf(account);

    for (uint16 i = 0; i < records.length; i++) {
      // TODO: for big planets
      if ((records[i].axialCoordinateQ == axialCoordinateQ) && (records[i].axialCoordinateR == axialCoordinateR)) {
        revert("duplicated coordinates");
      }
    }

    uint16 counter = _userNormalPlanetIdCounterPermanence.read(account);
    _userNormalPlanetIdCounterPermanence.update(account, counter + 1);
    _userNormalPlanetPermanence.pushElement(
      account,
      buildUint256FromUserNormalPlanetRecord(
        UserNormalPlanetRecord(
          counter,
          normalPlanetId,
          kind,
          param,
          1,
          uint32now(),
          uint32now(),
          axialCoordinateQ,
          axialCoordinateR
        )
      )
    );
  }

  // TODO: unmint
  // https://ethereum.stackexchange.com/questions/1527/how-to-delete-an-element-at-a-certain-index-in-an-array

  function rankupUserNormalPlanet(address account, uint16 userPlanetId) internal {
    (uint256 target, uint16 index) = _userNormalPlanetUint256WithIndexOf(account, userPlanetId);
    UserNormalPlanetRecord memory record = buildUserNormalPlanetRecordFromUint256(target);

    uint8 newRank = record.rank + 1;
    require(newRank <= 30, "max rank");
    _userNormalPlanetPermanence.updateByIndex(
      account,
      index,
      buildUint256FromUserNormalPlanetRecord(
        UserNormalPlanetRecord(
          record.id,
          record.normalPlanetId,
          record.kind,
          record.originalParam,
          newRank,
          uint32now(),
          record.createdAt,
          record.axialCoordinateQ,
          record.axialCoordinateR
        )
      )
    );
  }

  function buildUserNormalPlanetRecordFromUint256(uint256 source)
    internal
    pure
    returns (UserNormalPlanetRecord)
  {
    uint16 id = uint16(
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
    uint16 originalParam = uint16(
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
    int16 axialCoordinateQ = int16(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_Q_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_Q_END_DIGIT
      )
    );
    int16 axialCoordinateR = int16(
      interpretPermanenceUint256(
        source,
        USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_R_START_DIGIT,
        USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_R_END_DIGIT
      )
    );

    if (kind == 0) {
      revert("faild to build user normal planet, it's not created");
    }

    return UserNormalPlanetRecord(
      id,
      normalPlanetId,
      kind,
      originalParam,
      rank,
      rankupedAt,
      createdAt,
      axialCoordinateQ,
      axialCoordinateR
    );
  }

  function buildUint256FromUserNormalPlanetRecord(UserNormalPlanetRecord record)
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
      record.originalParam
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
      USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_Q_START_DIGIT,
      USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_Q_END_DIGIT,
      uint16(record.axialCoordinateQ)
    );
    return reinterpretPermanenceUint256(
      n,
      USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_R_START_DIGIT,
      USER_NORMAL_PLANET_PERMANENCE_AXIAL_COORDINATE_R_END_DIGIT,
      uint16(record.axialCoordinateR)
    );
  }

  function _userNormalPlanetUint256WithIndexOf(address account, uint16 userPlanetId)
    private
    view
    returns (uint256, uint16)
  {
    uint256[] memory us = _userNormalPlanetPermanence.read(account);
    uint256 target = 0;
    uint16 index;

    for (uint16 i = 0; i < us.length; i++) {
      if (uint16(
        interpretPermanenceUint256(
          us[i],
          USER_NORMAL_PLANET_PERMANENCE_ID_START_DIGIT,
          USER_NORMAL_PLANET_PERMANENCE_ID_END_DIGIT
        )
      ) == userPlanetId) {
        target = us[i];
        index = i;
        break;
      }
    }

    if (target == 0) {
      revert("user normal planet is not found");
    }

    return (target, index);
  }
}
