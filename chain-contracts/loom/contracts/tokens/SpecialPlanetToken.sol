pragma solidity 0.5.13;

import "./SpecialPlanetTokenBase.sol";

contract SpecialPlanetToken is SpecialPlanetTokenBase {
  address public gateway;

  constructor(address _gateway) public {
    gateway = _gateway;
  }

  // Used by the DAppChain Gateway to mint tokens that have been deposited to the Ethereum Gateway
  function mintToGateway(uint256 id) external {
    require(msg.sender == gateway, "SpecialPlanetToken: only the gateway is allowed to mint");
    _mint(gateway, id);
  }
}
