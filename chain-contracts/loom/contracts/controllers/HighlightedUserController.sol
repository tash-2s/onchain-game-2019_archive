pragma solidity 0.5.13;

import "./modules/UserGoldControllable.sol";

contract HighlightedUserController is UserGoldControllable {
  uint8 private constant _USERS_COUNT = 100;
  uint200 public thresholdGold = 0;

  // address <=> uint160
  // [user1.account, user1,gold, user2.account, user2.gold, ...]
  uint200[] private _users = new uint200[](_USERS_COUNT * 2);

  constructor(address userGoldPermanenceAddress) public {
    userGoldPermanence = UserGoldPermanence(userGoldPermanenceAddress);
  }

  function getUsers() external view returns (address[] memory accounts, uint200[] memory golds) {
    accounts = new address[](_USERS_COUNT);
    golds = new uint200[](_USERS_COUNT);

    for (uint256 i = 0; i < _USERS_COUNT; i++) {
      accounts[i] = address(_users[i * 2]);
      golds[i] = _users[i * 2 + 1];
    }
  }

  function tackle(address account) external {
    uint200 newGold = userGoldRecordOf(account).balance;

    if (newGold < thresholdGold) {
      return;
    }

    uint256 rand = block.number % _USERS_COUNT;

    uint200 oldGold = _users[rand * 2 + 1];

    thresholdGold = (oldGold + newGold + thresholdGold) / 3;
    _users[rand * 2 + 0] = uint200(account);
    _users[rand * 2 + 1] = newGold;
  }
}
