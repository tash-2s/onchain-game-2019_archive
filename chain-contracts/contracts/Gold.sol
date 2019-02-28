pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

import "./lib/Util.sol";

contract Gold is MinterRole {
  using SafeMath for uint200;

  // https://ethereum.stackexchange.com/questions/27813/max-min-values-of-standard-data-types
  uint200 constant UINT200_MAX = ~uint200(0);

  struct UserGold {
    uint200 balance;
    uint40 confirmedAt;
  }

  mapping(address => UserGold) private _addressToUserGold;

  function userGold(address account) public view returns (uint200, uint40) {
    UserGold storage _userGold = _addressToUserGold[account];
    return (_userGold.balance, _userGold.confirmedAt);
  }

  function userGoldConfirmedAt(address account) public view returns (uint40) {
    return _addressToUserGold[account].confirmedAt;
  }

  function userGoldBalance(address account) public view returns (uint200) {
    return _addressToUserGold[account].balance;
  }

  // You must "confirm" before calling this function.
  function mint(address account, uint200 quantity) public onlyMinter {
    UserGold storage _userGold = _addressToUserGold[account];

    if ((_userGold.balance + quantity) >= _userGold.balance) {
      _addressToUserGold[account] = UserGold(_userGold.balance + quantity, Util.uint40now());
    } else {
      _addressToUserGold[account] = UserGold(UINT200_MAX, Util.uint40now());
    }
  }

  // You must "confirm" before calling this function.
  function unmint(address account, uint200 quantity) public onlyMinter {
    UserGold storage _userGold = _addressToUserGold[account];
    _addressToUserGold[account] = UserGold(uint200(_userGold.balance.sub(quantity)), Util.uint40now());
  }
}
