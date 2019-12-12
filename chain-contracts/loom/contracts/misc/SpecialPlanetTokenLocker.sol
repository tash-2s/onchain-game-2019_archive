pragma solidity 0.5.13;

import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

import "../tokens/SpecialPlanetToken.sol";

import "../libraries/SpecialPlanetTokenIdInterpreter.sol";

contract SpecialPlanetTokenLocker is ERC721Holder, WhitelistedRole {
  SpecialPlanetToken public specialPlanetToken;

  mapping(uint24 => uint256) public shortIdToTokenId;
  mapping(uint256 => address) public tokenIdToOwner;

  constructor(address specialPlanetTokenAddress) public {
    specialPlanetToken = SpecialPlanetToken(specialPlanetTokenAddress);
  }

  // need token's approval
  function lock(address _owner, uint256 tokenId) external onlyWhitelisted {
    address owner = specialPlanetToken.ownerOf(tokenId);
    require(owner == _owner, "locker: wrong owner");

    specialPlanetToken.safeTransferFrom(owner, address(this), tokenId);

    (uint24 shortId, , , , ) = SpecialPlanetTokenIdInterpreter.idToFields(tokenId);

    shortIdToTokenId[shortId] = tokenId;
    tokenIdToOwner[tokenId] = owner;
  }

  function unlock(address _owner, uint24 shortId) external onlyWhitelisted {
    uint256 tokenId = shortIdToTokenId[shortId];
    address owner = tokenIdToOwner[tokenId];

    require(tokenId != 0 && owner != address(0) && owner == _owner, "locker: wrong owner or id");

    specialPlanetToken.safeTransferFrom(address(this), owner, tokenId);
    delete tokenIdToOwner[tokenId];
  }
}
