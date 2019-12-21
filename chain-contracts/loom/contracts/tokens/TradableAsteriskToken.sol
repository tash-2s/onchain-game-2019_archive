pragma solidity 0.5.13;

import "./TradableAsteriskTokenBase.sol";

contract TradableAsteriskToken is TradableAsteriskTokenBase {
  address public gateway;

  constructor(address _gateway) public {
    gateway = _gateway;
  }

  // Used by the DAppChain Gateway to mint tokens that have been deposited to the Ethereum Gateway
  function mintToGateway(uint256 id) external {
    require(msg.sender == gateway, "TradableAsteriskToken: only the gateway is allowed to mint");
    _mint(gateway, id);
  }
}
