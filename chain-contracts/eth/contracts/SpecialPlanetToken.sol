pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Pausable.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

import "./SpecialPlanetTokenMetadata.sol";

contract SpecialPlanetToken is
  ERC721Enumerable,
  ERC721Mintable,
  ERC721Pausable,
  SpecialPlanetTokenMetadata,
  Ownable
{
  address public gateway;

  constructor(address gatewayAddress) public {
    gateway = gatewayAddress;
  }

  function depositToGateway(uint256 id) public {
    safeTransferFrom(msg.sender, gateway, id);
  }
}
