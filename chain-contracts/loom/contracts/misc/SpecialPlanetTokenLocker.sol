pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";

import "../tokens/SpecialPlanetToken.sol";

contract SpecialPlanetTokenLocker is ERC721Holder, MinterRole {
  SpecialPlanetToken public specialPlanetToken;

  mapping(uint24 => uint256) public shortIdToTokenId;

  mapping(uint256 => address) public tokenIdToOwner;

  constructor(address specialPlanetTokenAddress) public {
    specialPlanetToken = SpecialPlanetToken(specialPlanetTokenAddress);
  }

  // this should be called after the transfers of tokens to this contract
  function setup(address owner, uint256 tokenId, uint24 shortId) external onlyMinter {
    require(specialPlanetToken.ownerOf(tokenId) == address(this), "locker: wrong owner");

    shortIdToTokenId[shortId] = tokenId;
    tokenIdToOwner[tokenId] = owner;
  }

  function withdraw(uint24 shortId) external onlyMinter {
    uint256 tokenId = shortIdToTokenId[shortId];
    specialPlanetToken.safeTransferFrom(address(this), tokenIdToOwner[tokenId], tokenId);
    delete tokenIdToOwner[tokenId];
  }
}
