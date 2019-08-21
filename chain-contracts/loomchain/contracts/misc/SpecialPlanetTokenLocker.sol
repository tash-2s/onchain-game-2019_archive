pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";

import "../tokens/SpecialPlanetToken.sol";

import "../../../SpecialPlanetConstants.sol";

contract SpecialPlanetTokenLocker is ERC721Holder, MinterRole, SpecialPlanetConstants {
  SpecialPlanetToken public specialPlanetToken;

  mapping(uint24 => uint256) public shortIdToTokenId;

  mapping(uint256 => address) public tokenIdToOwner;

  constructor(address specialPlanetTokenAddress) public {
    specialPlanetToken = SpecialPlanetToken(specialPlanetTokenAddress);
  }

  // this should be called after the transfers of tokens to this contract
  function setupAndParseTokenId(address owner, uint256 tokenId)
    external
    onlyMinter
    returns (uint24, uint8, uint8, uint8, uint64)
  {
    require(specialPlanetToken.ownerOf(tokenId) == address(this), "locker: wrong owner");

    uint24 shortId = uint24(tokenId >> TOKEN_ID_SHORT_ID_START_BIT);
    uint8 version = uint8(tokenId >> TOKEN_ID_VERSION_START_BIT);
    uint8 kind = uint8(tokenId >> TOKEN_ID_KIND_START_BIT);
    uint8 originalParamCommonLogarithm = uint8(tokenId >> TOKEN_ID_OPCL_START_BIT);
    uint64 artSeed = uint64(tokenId >> TOKEN_ID_ART_SEED_START_BIT);

    shortIdToTokenId[shortId] = tokenId;
    tokenIdToOwner[tokenId] = owner;

    return (shortId, version, kind, originalParamCommonLogarithm, artSeed);
  }

  function withdraw(uint24 shortId) external onlyMinter {
    uint256 tokenId = shortIdToTokenId[shortId];
    specialPlanetToken.safeTransferFrom(address(this), tokenIdToOwner[tokenId], tokenId);
    delete tokenIdToOwner[tokenId];
  }

  function extractShortIdFromTokenId(uint256 tokenId) public pure returns (uint24) {
    return uint24(tokenId >> TOKEN_ID_SHORT_ID_START_BIT);
  }
}
