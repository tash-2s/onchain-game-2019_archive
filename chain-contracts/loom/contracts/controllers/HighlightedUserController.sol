pragma solidity 0.5.11;

import "./modules/UserGoldControllable.sol";

contract HighlightedUserController is UserGoldControllable {
  uint8 constant USERS_COUNT = 100;
  uint200 public thresholdGold = 0;

  // address <=> uint160
  // [user1.account, user1,gold, user2.account, user2.gold, ...]
  uint200[] private _users = new uint200[](USERS_COUNT * 2);

  constructor(address userGoldPermanenceAddress) public {
    setUserGoldPermanence(userGoldPermanenceAddress);
  }

  function getUsers() external view returns (address[] memory accounts, uint200[] memory golds) {
    accounts = new address[](USERS_COUNT);
    golds = new uint200[](USERS_COUNT);

    for (uint8 i = 0; i < USERS_COUNT; i++) {
      accounts[i] = address(_users[i * 2]);
      golds[i] = _users[i * 2 + 1];
    }
  }

  function tackle(address account) external {
    uint200 newGold = userGoldRecordOf(account).balance;

    if (newGold < thresholdGold) {
      return;
    }

    uint8 rand = uint8(block.number % USERS_COUNT);

    uint200 oldGold = _users[rand * 2 + 1];

    thresholdGold = (oldGold + newGold + thresholdGold) / 3;
    _users[rand * 2 + 0] = uint200(account);
    _users[rand * 2 + 1] = newGold;
  }
}
