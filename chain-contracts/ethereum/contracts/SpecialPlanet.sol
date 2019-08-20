pragma solidity 0.5.11;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Pausable.sol";

contract SpecialPlanet is ERC721Enumerable, ERC721Mintable, ERC721MetadataMintable, ERC721Pausable {
  // Transfer Gateway contract address
  address public gateway;

  // TODO: change name
  constructor(address gatewayAddress) public ERC721Metadata("HOGEHOGE", "HOG") {
    gateway = gatewayAddress;
  }

  function depositToGateway(uint256 id) public {
    safeTransferFrom(msg.sender, gateway, id);
  }
}
