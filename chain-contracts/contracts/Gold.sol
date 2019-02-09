pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract Gold is MinterRole {
  using SafeMath for uint256;

  mapping(address => uint256) private balances;

  function balanceOf(address account) public view returns (uint256) {
    return balances[account];
  }

  // TODO: This should have a cap logic (if the balance reaches the max, it should be ignored without an error)
  function mint(address to, uint256 value) public onlyMinter returns (bool) {
    balances[to] = balances[to].add(value);
    return true;
  }
}
