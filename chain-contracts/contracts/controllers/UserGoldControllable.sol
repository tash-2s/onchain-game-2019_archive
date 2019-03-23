pragma solidity 0.4.24;

import "./PermanenceInterpretable.sol";
import "../permanences/UserGoldPermanence.sol";
import "./TimeGettable.sol";

contract UserGoldControllable is PermanenceInterpretable, TimeGettable {
  // https://ethereum.stackexchange.com/questions/27813/max-min-values-of-standard-data-types
  uint200 constant UINT200_MAX = ~uint200(0);

  struct UserGoldRecord {
    uint200 balance;
    uint40 confirmedAt;
  }

  UserGoldPermanence private _userGoldPermanence;

  function userGoldPermanence() public view returns (UserGoldPermanence) {
    return _userGoldPermanence;
  }

  function setUserGoldPermanence(address permanenceAddress) internal {
    _userGoldPermanence = UserGoldPermanence(permanenceAddress);
  }

  function userGoldRecordOf(address account) internal view returns (UserGoldRecord) {
    return buildUserGoldRecord(_userGoldPermanence.read(account));
  }

  function mintGold(address account, uint256 quantity) internal {
    UserGoldRecord memory record = userGoldRecordOf(account);

    if ((quantity >= UINT200_MAX) || ((record.balance + uint200(quantity)) < record.balance)) {
      updateUserGoldRecord(account, UserGoldRecord(UINT200_MAX, uint40now()));
    } else {
      updateUserGoldRecord(
        account,
        UserGoldRecord(record.balance + uint200(quantity), uint40now())
      );
    }
  }

  function unmintGold(address account, uint256 quantity) internal {
    UserGoldRecord memory record = userGoldRecordOf(account);

    require(record.balance >= quantity, "not enough gold balance");

    updateUserGoldRecord(account, UserGoldRecord(record.balance - uint200(quantity), uint40now()));
  }

  function updateUserGoldRecord(address account, UserGoldRecord record) internal {
    _userGoldPermanence.update(account, transformUserGoldRecordToUint256(record));
  }

  function transformUserGoldRecordToUint256(UserGoldRecord record) internal pure returns (uint256) {
    uint256 i = reinterpretPermanenceUint256(0, 1, 61, record.balance);
    i = reinterpretPermanenceUint256(i, 62, 74, record.confirmedAt);

    return i;
  }

  function buildUserGoldRecord(uint256 source) internal pure returns (UserGoldRecord) {
    uint200 balance = uint200(interpretPermanenceUint256(source, 1, 61));
    uint40 confirmedAt = uint40(interpretPermanenceUint256(source, 62, 74));

    return UserGoldRecord(balance, confirmedAt);
  }
}
