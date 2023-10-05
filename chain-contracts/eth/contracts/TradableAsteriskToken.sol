pragma solidity 0.5.13;

import "./TradableAsteriskTokenBase.sol";

contract TradableAsteriskToken is TradableAsteriskTokenBase {
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
