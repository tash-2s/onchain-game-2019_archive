pragma solidity 0.5.11;

import "../../../SpecialPlanetTokenCommon.sol";

contract SpecialPlanetToken is SpecialPlanetTokenCommon {
  // Transfer Gateway contract address
  address public gateway;

  // TODO: change name
  constructor(address gatewayAddress) public {
    gateway = gatewayAddress;
  }

  // Used by the DAppChain Gateway to mint tokens that have been deposited to the Ethereum Gateway
  function mintToGateway(uint256 id) public {
    require(msg.sender == gateway, "only the gateway is allowed to mint");
    _mint(gateway, id);
  }
}
