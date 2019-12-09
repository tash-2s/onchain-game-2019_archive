pragma solidity 0.5.13;

import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

import "./SpecialPlanetTokenBase.sol";

contract SpecialPlanetToken is SpecialPlanetTokenBase, ERC721Mintable {
  address public gateway;

  constructor(address _gateway) public {
    gateway = _gateway;
  }

  function depositToGateway(uint256 id) external {
    safeTransferFrom(msg.sender, gateway, id);
  }
}
