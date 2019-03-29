pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract AddressToUint256ArrayPermanence is MinterRole {
  mapping(address => uint256[]) private _addressToUint256Array;

  function read(address addr) public view returns (uint256[]) {
    return _addressToUint256Array[addr];
  }

  function update(address addr, uint256[] ui256Array) public onlyMinter {
    _addressToUint256Array[addr] = ui256Array;
  }

  function pushElement(address addr, uint256 ui256) public onlyMinter {
    _addressToUint256Array[addr].push(ui256);
  }

  // TODO: with unmint
  // function deleteByIndex(address addr, uint256 index) public onlyMinter {
  //
  // }

  function readByIndex(address addr, uint256 index) public view returns (uint256) {
    return _addressToUint256Array[addr][index];
  }

  function updateByIndex(address addr, uint256 index, uint256 ui256) public onlyMinter {
    _addressToUint256Array[addr][index] = ui256;
  }

  function arrayLength(address addr) public view returns (uint256) {
    return _addressToUint256Array[addr].length;
  }
}
