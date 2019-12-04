pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";

import "../../SpecialPlanetTokenCommon.sol";

contract SpecialPlanetToken is SpecialPlanetTokenCommon, ERC721Mintable {
  address public gateway;

  constructor(address _gateway) public {
    gateway = _gateway;
  }

  function depositToGateway(uint256 id) external {
    safeTransferFrom(msg.sender, gateway, id);
  }
}
