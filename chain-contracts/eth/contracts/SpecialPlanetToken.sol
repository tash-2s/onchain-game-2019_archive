pragma solidity 0.5.13;

import "./SpecialPlanetTokenBase.sol";

contract SpecialPlanetToken is SpecialPlanetTokenBase {
  address public gateway;

  constructor(address _gateway) public {
    gateway = _gateway;
  }

  function depositToGateway(uint256 id) external {
    safeTransferFrom(msg.sender, gateway, id);
  }

  function mint(address to, uint256 tokenId) external onlyWhitelisted {
    _mint(to, tokenId);
  }
}
