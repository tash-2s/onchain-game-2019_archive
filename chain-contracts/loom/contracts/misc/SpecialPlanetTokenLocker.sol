pragma solidity 0.5.13;

import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

import "../tokens/SpecialPlanetToken.sol";

contract SpecialPlanetTokenLocker is ERC721Holder, WhitelistedRole {
  SpecialPlanetToken public specialPlanetToken;

  mapping(uint24 => uint256) public shortIdToTokenId;

  mapping(uint256 => address) public tokenIdToOwner;

  constructor(address specialPlanetTokenAddress) public {
    specialPlanetToken = SpecialPlanetToken(specialPlanetTokenAddress);
  }

  // this should be called after the transfers of tokens to this contract
  function setup(address owner, uint256 tokenId, uint24 shortId) external onlyWhitelisted {
    require(specialPlanetToken.ownerOf(tokenId) == address(this), "locker: wrong owner");

    shortIdToTokenId[shortId] = tokenId;
    tokenIdToOwner[tokenId] = owner;
  }

  function withdraw(uint24 shortId) external onlyWhitelisted {
    uint256 tokenId = shortIdToTokenId[shortId];
    specialPlanetToken.safeTransferFrom(address(this), tokenIdToOwner[tokenId], tokenId);
    delete tokenIdToOwner[tokenId];
  }
}
