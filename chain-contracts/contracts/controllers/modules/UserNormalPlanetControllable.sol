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
      records[i] = buildUserNormalPlanetRecord(us[i]);
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
    uint256[] memory us = _userNormalPlanetPermanence.read(account);
    uint256 target;
    uint16 tmpId;

    for (uint16 i = 0; i < us.length; i++) {
      tmpId = uint16(interpretPermanenceUint256(us[i], 1, 5));

      if (tmpId == userPlanetId) {
        target = us[i];
        break;
      }
    }

    return buildUserNormalPlanetRecord(target);
  }

  function buildUserNormalPlanetRecord(uint256 source)
    internal
    pure
    returns (UserNormalPlanetRecord)
  {
    uint16 id = uint16(interpretPermanenceUint256(source, 1, 5));
    uint16 normalPlanetId = uint16(interpretPermanenceUint256(source, 6, 10));
    uint8 kind = uint8(interpretPermanenceUint256(source, 11, 13));
    uint16 originalParam = uint16(interpretPermanenceUint256(source, 14, 18));
    uint8 rank = uint8(interpretPermanenceUint256(source, 19, 21));
    uint32 rankupedAt = uint32(interpretPermanenceUint256(source, 22, 31));
    uint32 createdAt = uint32(interpretPermanenceUint256(source, 32, 41));
    int16 axialCoordinateQ = int16(interpretPermanenceUint256(source, 42, 46)); // works well?
    int16 axialCoordinateR = int16(interpretPermanenceUint256(source, 47, 51));

    if (kind == 0) {
      revert("faild to build user normal planet, it's not defined");
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
    _userNormalPlanetPermanence.addElement(
      account,
      transformUserNormalPlanetAttributesToUint256(
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
    );
  }

  // TODO: unmint
  // https://ethereum.stackexchange.com/questions/1527/how-to-delete-an-element-at-a-certain-index-in-an-array

  function transformUserNormalPlanetAttributesToUint256(
    uint16 id,
    uint16 normalPlanetId,
    uint8 kind,
    uint16 param,
    uint8 rank,
    uint32 rankupedAt,
    uint32 createdAt,
    int16 axialCoordinateQ,
    int16 axialCoordinateR
  ) public pure returns (uint256) {
    uint256 i = reinterpretPermanenceUint256(0, 1, 5, id);
    i = reinterpretPermanenceUint256(i, 6, 10, normalPlanetId);
    i = reinterpretPermanenceUint256(i, 11, 13, kind);
    i = reinterpretPermanenceUint256(i, 14, 18, param);
    i = reinterpretPermanenceUint256(i, 19, 21, rank);
    i = reinterpretPermanenceUint256(i, 22, 31, rankupedAt);
    i = reinterpretPermanenceUint256(i, 32, 41, createdAt);
    i = reinterpretPermanenceUint256(i, 42, 46, uint16(axialCoordinateQ));
    i = reinterpretPermanenceUint256(i, 47, 51, uint16(axialCoordinateR));

    return i;
  }

  function _rankupUserNormalPlanet(address account, uint16 userPlanetId) internal {
    UserNormalPlanetRecord[] memory records = userNormalPlanetRecordsOf(account);
    UserNormalPlanetRecord memory record;

    for (uint16 i = 0; i < records.length; i++) {
      record = records[i];

      if (record.id == userPlanetId) {
        uint8 newRank = record.rank + 1;
        require(newRank <= 30, "max rank");
        _userNormalPlanetPermanence.updateByIndex(
          account,
          i,
          transformUserNormalPlanetAttributesToUint256(
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
        );
        break;
      }
    }
  }
}
