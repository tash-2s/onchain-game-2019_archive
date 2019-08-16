pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Pausable.sol";

contract Erc721SpecialPlanet is ERC721Full, ERC721Pausable {
  // Transfer Gateway contract address
  address public gateway;

  // TODO: change name
  constructor(address gatewayAddress) public ERC721Full("HOGEHOGE", "HOG") {
    gateway = gatewayAddress;
  }

  // Used by the DAppChain Gateway to mint tokens that have been deposited to the Ethereum Gateway
  function mintToGateway(uint256 id) public {
    require(msg.sender == gateway, "only the gateway is allowed to mint");
    _mint(gateway, id);
  }
}
