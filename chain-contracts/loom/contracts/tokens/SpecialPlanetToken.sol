pragma solidity 0.5.11;

import "../../../SpecialPlanetTokenCommon.sol";

contract SpecialPlanetToken is SpecialPlanetTokenCommon {
  address public gateway;

  constructor(address _gateway) public {
    gateway = _gateway;
  }

  // Used by the DAppChain Gateway to mint tokens that have been deposited to the Ethereum Gateway
  function mintToGateway(uint256 id) public {
    require(msg.sender == gateway, "only the gateway is allowed to mint");
    _mint(gateway, id);
  }
}
