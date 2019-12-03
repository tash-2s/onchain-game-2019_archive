pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";

contract AddressArrayPermanence is MinterRole {
  address[] private _addressArray;

  function count() public view returns (uint256) {
    return _addressArray.length;
  }

  function read() public view returns (address[] memory) {
    return _addressArray;
  }

  function update(address[] memory addrs) public onlyMinter {
    _addressArray = addrs;
  }

  function deleteAll() public onlyMinter {
    delete _addressArray;
  }

  function readRange(uint256 start, uint256 end) public view returns (address[] memory) {
    require(start <= end, "wrong range");
    address[] memory addresses = new address[](end - start + 1);
    for (uint256 i = start; i <= end; i++) {
      addresses[i - start] = _addressArray[i];
    }
    return addresses;
  }

  function readElement(uint256 index) public view returns (address) {
    return _addressArray[index];
  }

  function createElement(address addr) public onlyMinter returns (uint256) {
    return _addressArray.push(addr);
  }

  function updateElement(uint256 index, address addr) public onlyMinter {
    require(count() > index, "out of range index");
    _addressArray[index] = addr;
  }

  function deleteElement(uint256 index) public onlyMinter {
    delete _addressArray[index]; // assign the initial value (0x0)
  }
}
