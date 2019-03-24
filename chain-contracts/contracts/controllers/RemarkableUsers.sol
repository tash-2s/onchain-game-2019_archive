pragma solidity 0.4.24;

import "./modules/UserGoldControllable.sol";

contract RemarkableUsers is UserGoldControllable {
  uint constant USERS_COUNT = 100;
  uint200 public thresholdGold = 0;

  // address <=> uint160
  // [user1.account, user1,gold, user2.account, user2.gold, ...]
  uint200[] private _users = new uint200[](USERS_COUNT * 2);

  constructor(address userGoldPermanenceAddress) public {
    setUserGoldPermanence(userGoldPermanenceAddress);
  }

  function getUsers() external view returns (address[] accounts, uint200[] golds) {
    accounts = new address[](USERS_COUNT);
    golds = new uint200[](USERS_COUNT);
    uint j = 0;

    for (uint i = 0; i < USERS_COUNT; i++) {
      accounts[i] = address(_users[j]);
      golds[i] = _users[j + 1];
      j += 2;
    }
  }

  function tackle(address account) public {
    uint200 newGold = userGoldRecordOf(account).balance;

    if (newGold < thresholdGold) {
      return;
    }

    uint rand = block.number % USERS_COUNT;

    uint200 oldGold = _users[rand * 2 + 1];

    thresholdGold = (oldGold + newGold + thresholdGold) / 3;
    _users[rand * 2 + 0] = uint200(account);
    _users[rand * 2 + 1] = newGold;
  }
}
