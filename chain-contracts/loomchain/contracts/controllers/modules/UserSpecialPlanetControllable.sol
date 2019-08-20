pragma solidity 0.5.11;

import "./TimeGettable.sol";

import "../../permanences/UserSpecialPlanetPermanence.sol";
import "../../permanences/UserSpecialPlanetIdToOwnerPermanence.sol";

contract UserSpecialPlanetControllable is TimeGettable {
  UserSpecialPlanetPermanence private _userSpecialPlanetPermanence;
  UserSpecialPlanetIdToOwnerPermanence private _userSpecialPlanetIdToOwnerPermanence;

  int16 constant INT16_MAX = int16(~(uint16(1) << 15));
  int16 constant AXIAL_COORDINATE_NONE = INT16_MAX;

  struct UserSpecialPlanetRecord {
    uint24 id;
    uint8 kind;
    uint8 originalParamCommonLogarithm;
    uint8 rank;
    uint32 rankupedAt;
    uint32 createdAt;
    int16 axialCoordinateQ;
    int16 axialCoordinateR;
  }

  uint8 constant USER_SPECIAL_PLANET_PERMANENCE_ID_START_BIT = 0;
  uint8 constant USER_SPECIAL_PLANET_PERMANENCE_KIND_START_BIT = 24;
  uint8 constant USER_SPECIAL_PLANET_PERMANENCE_ORIGINAL_PARAM_COMMON_LOGARITHM_START_BIT = 24 + 8;
  uint8 constant USER_SPECIAL_PLANET_PERMANENCE_RANK_START_BIT = 24 + 8 + 8;
  uint8 constant USER_SPECIAL_PLANET_PERMANENCE_RANKUPED_AT_START_BIT = 24 + 8 + 8 + 8;
  uint8 constant USER_SPECIAL_PLANET_PERMANENCE_CREATED_AT_START_BIT = 24 + 8 + 8 + 8 + 32;
  uint8 constant USER_SPECIAL_PLANET_PERMANENCE_AXIAL_COORDINATE_Q_START_BIT = 24 +
    8 +
    8 +
    8 +
    32 +
    32;
  uint8 constant USER_SPECIAL_PLANET_PERMANENCE_AXIAL_COORDINATE_R_START_BIT = 24 +
    8 +
    8 +
    8 +
    32 +
    32 +
    16;

  function userSpecialPlanetPermanence() public view returns (UserSpecialPlanetPermanence) {
    return _userSpecialPlanetPermanence;
  }

  function setUserSpecialPlanetPermanence(address addr) internal {
    _userSpecialPlanetPermanence = UserSpecialPlanetPermanence(addr);
  }

  function userSpecialPlanetIdToOwnerPermanence()
    public
    view
    returns (UserSpecialPlanetIdToOwnerPermanence)
  {
    return _userSpecialPlanetIdToOwnerPermanence;
  }

  function setUserSpecialPlanetIdToOwnerPermanence(address addr) internal {
    _userSpecialPlanetIdToOwnerPermanence = UserSpecialPlanetIdToOwnerPermanence(addr);
  }

  function userSpecialPlanetRecordsOf(address account)
    internal
    view
    returns (UserSpecialPlanetRecord[])
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

  function userSpecialPlanetRecordOf(address account, uint24 userPlanetId)
    internal
    view
    returns (UserSpecialPlanetRecord)
  {
    UserSpecialPlanetRecord memory record;
    (record, ) = _userSpecialPlanetRecordWithIndexOf(account, userPlanetId);
    return record;
  }

  // if you know the owner address of the planet, you should use above function instead of this
  function userSpecialPlanetRecordOf(uint24 userPlanetId)
    internal
    view
    returns (UserSpecialPlanetRecord)
  {
    address account = _userSpecialPlanetIdToOwnerPermanence.readElement(userPlanetId - 1);
    return userSpecialPlanetRecordOf(account, userPlanetId);
  }

  function mintUserSpecialPlanet(address account, uint8 kind, uint8 paramCommonLogarithm)
    internal
    returns (uint24)
  {
    uint24 id = uint24(_userSpecialPlanetIdToOwnerPermanence.createElement(account));

    _userSpecialPlanetPermanence.createElement(
      account,
      buildBytes32FromUserSpecialPlanetRecord(
        UserSpecialPlanetRecord(
          id,
          kind,
          paramCommonLogarithm,
          1,
          uint32now(),
          uint32now(),
          AXIAL_COORDINATE_NONE,
          AXIAL_COORDINATE_NONE
        )
      )
    );

    return id;
  }

  // TODO: I should check the coordinates
  function updateUserSpecialPlanetAxialCoordinates(
    address account,
    uint24 userPlanetId,
    int16 axialCoordinateQ,
    int16 axialCoordinateR
  ) internal {
    UserSpecialPlanetRecord memory record;
    uint16 index;
    (record, index) = _userSpecialPlanetRecordWithIndexOf(account, userPlanetId);

    _userSpecialPlanetPermanence.updateElement(
      account,
      index,
      buildBytes32FromUserSpecialPlanetRecord(
        UserSpecialPlanetRecord(
          record.id,
          record.kind,
          record.originalParamCommonLogarithm,
          record.rank,
          uint32now(),
          record.createdAt,
          axialCoordinateQ,
          axialCoordinateR
        )
      )
    );
  }

  function buildUserSpecialPlanetRecordFromBytes32(bytes32 b)
    internal
    pure
    returns (UserSpecialPlanetRecord)
  {
    return
      UserSpecialPlanetRecord(
        uint24(b >> USER_SPECIAL_PLANET_PERMANENCE_ID_START_BIT),
        uint8(b >> USER_SPECIAL_PLANET_PERMANENCE_KIND_START_BIT),
        uint8(b >> USER_SPECIAL_PLANET_PERMANENCE_ORIGINAL_PARAM_COMMON_LOGARITHM_START_BIT),
        uint8(b >> USER_SPECIAL_PLANET_PERMANENCE_RANK_START_BIT),
        uint32(b >> USER_SPECIAL_PLANET_PERMANENCE_RANKUPED_AT_START_BIT),
        uint32(b >> USER_SPECIAL_PLANET_PERMANENCE_CREATED_AT_START_BIT),
        int16(b >> USER_SPECIAL_PLANET_PERMANENCE_AXIAL_COORDINATE_Q_START_BIT),
        int16(b >> USER_SPECIAL_PLANET_PERMANENCE_AXIAL_COORDINATE_R_START_BIT)
      );
  }

  function buildBytes32FromUserSpecialPlanetRecord(UserSpecialPlanetRecord r)
    internal
    pure
    returns (bytes32)
  {
    return
      (bytes32(r.id) << USER_SPECIAL_PLANET_PERMANENCE_ID_START_BIT) |
        (bytes32(r.kind) << USER_SPECIAL_PLANET_PERMANENCE_KIND_START_BIT) |
        (bytes32(r.originalParamCommonLogarithm) <<
          USER_SPECIAL_PLANET_PERMANENCE_ORIGINAL_PARAM_COMMON_LOGARITHM_START_BIT) |
        (bytes32(r.rank) << USER_SPECIAL_PLANET_PERMANENCE_RANK_START_BIT) |
        (bytes32(r.rankupedAt) << USER_SPECIAL_PLANET_PERMANENCE_RANKUPED_AT_START_BIT) |
        (bytes32(r.createdAt) << USER_SPECIAL_PLANET_PERMANENCE_CREATED_AT_START_BIT) |
        (bytes32(uint16(r.axialCoordinateQ)) <<
          USER_SPECIAL_PLANET_PERMANENCE_AXIAL_COORDINATE_Q_START_BIT) |
        (bytes32(uint16(r.axialCoordinateR)) <<
          USER_SPECIAL_PLANET_PERMANENCE_AXIAL_COORDINATE_R_START_BIT);
  }

  function _userSpecialPlanetRecordWithIndexOf(address account, uint24 userPlanetId)
    private
    view
    returns (UserSpecialPlanetRecord, uint16)
  {
    bytes32[] memory us = _userSpecialPlanetPermanence.read(account);
    bytes32 target = bytes32(0);
    uint16 index;

    for (uint16 i = 0; i < us.length; i++) {
      if (uint24(us[i] >> USER_SPECIAL_PLANET_PERMANENCE_ID_START_BIT) == userPlanetId) {
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
