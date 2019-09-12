pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

import "./SpecialPlanetTokenMetadata.sol";

contract SpecialPlanetToken is
  ERC721Enumerable,
  ERC721Mintable,
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

  function tokensOfOwnerByIndex(address owner, uint256 index)
    external
    view
    returns (uint256[] memory tokenIds, uint256 nextIndex)
  {
    nextIndex = 0; // no next
    uint256 balance = balanceOf(owner);
    if (balance == 0) {
      return (new uint256[](0), nextIndex);
    }
    require(balance > index, "too big index");

    uint256 size = balance - index;
    if (size > 100) {
      size = 100;
      nextIndex = index + 100;
    }

    tokenIds = new uint256[](size);

    for (uint256 i = index; i < (index + size); i++) {
      tokenIds[i] = tokenOfOwnerByIndex(owner, i);
    }

    return (tokenIds, nextIndex);
  }
}
