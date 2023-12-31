pragma solidity 0.5.13;

import "../../libraries/Time.sol";

import "../../permanences/UserGoldPermanence.sol";

contract UserGoldControllable {
  uint200 private constant _UINT200_MAX = ~uint200(0);

  struct UserGoldRecord {
    uint200 balance;
    uint32 confirmedAt;
  }

  uint8 private constant _P_BALANCE_SHIFT_COUNT = 0;
  uint8 private constant _P_CONFIRMED_AT_SHIFT_COUNT = 200;

  UserGoldPermanence public userGoldPermanence;

  function userGoldRecordOf(address account) internal view returns (UserGoldRecord memory) {
    return buildUserGoldRecordFromBytes32(userGoldPermanence.read(account));
  }

  function mintGold(address account, uint256 quantity) internal {
    UserGoldRecord memory record = userGoldRecordOf(account);

    if ((quantity >= _UINT200_MAX) || ((record.balance + uint200(quantity)) < record.balance)) {
      updateUserGoldRecord(account, UserGoldRecord(_UINT200_MAX, Time.uint32now()));
    } else {
      updateUserGoldRecord(
        account,
        UserGoldRecord(record.balance + uint200(quantity), Time.uint32now())
      );
    }
  }

  function unmintGold(address account, uint256 quantity) internal {
    UserGoldRecord memory record = userGoldRecordOf(account);

    require(record.balance >= quantity, "not enough gold balance");

    updateUserGoldRecord(
      account,
      UserGoldRecord(record.balance - uint200(quantity), Time.uint32now())
    );
  }

  function touchGold(address account) internal {
    UserGoldRecord memory record = userGoldRecordOf(account);
    updateUserGoldRecord(account, UserGoldRecord(record.balance, Time.uint32now()));
  }

  function updateUserGoldRecord(address account, UserGoldRecord memory record) internal {
    userGoldPermanence.update(account, buildBytes32FromUserGoldRecord(record));
  }

  function buildBytes32FromUserGoldRecord(UserGoldRecord memory r) internal pure returns (bytes32) {
    return
      bytes32(
        (uint256(r.balance) << _P_BALANCE_SHIFT_COUNT) |
          (uint256(r.confirmedAt) << _P_CONFIRMED_AT_SHIFT_COUNT)
      );
  }

  function buildUserGoldRecordFromBytes32(bytes32 b) internal pure returns (UserGoldRecord memory) {
    uint256 ui = uint256(b);
    return
      UserGoldRecord(
        uint200(ui >> _P_BALANCE_SHIFT_COUNT),
        uint32(ui >> _P_CONFIRMED_AT_SHIFT_COUNT)
      );
  }
}
