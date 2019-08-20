pragma solidity 0.5.11;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

contract AddressToUint256NonOrderedArrayPermanence is MinterRole {
  mapping(address => uint256[]) private _addressToUint256Array;

  function read(address addr) public view returns (uint256[]) {
    return _addressToUint256Array[addr];
  }

  function count(address addr) public view returns (uint256) {
    return _addressToUint256Array[addr].length;
  }

  function update(address addr, uint256[] ui256Array) public onlyMinter {
    _addressToUint256Array[addr] = ui256Array;
  }

  // TODO: test
  function deleteAll(address addr) public onlyMinter {
    _addressToUint256Array[addr].length = 0;
  }

  function readElement(address addr, uint256 index) public view returns (uint256) {
    return _addressToUint256Array[addr][index];
  }

  // TODO: I should add an index check as same as AddressArrayPermanence
  function updateElement(address addr, uint256 index, uint256 ui256) public onlyMinter {
    _addressToUint256Array[addr][index] = ui256;
  }

  function createElement(address addr, uint256 ui256) public onlyMinter returns (uint256) {
    return _addressToUint256Array[addr].push(ui256);
  }

  // This function change the order of the array.
  function deleteElement(address addr, uint256 index) public onlyMinter {
    _addressToUint256Array[addr][index] = _addressToUint256Array[addr][_addressToUint256Array[addr]
        .length -
      1];
    _addressToUint256Array[addr].length--;
  }
}
