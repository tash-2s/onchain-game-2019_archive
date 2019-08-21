pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";

import "../tokens/SpecialPlanetToken.sol";

import "../../../SpecialPlanetConstants.sol";

contract SpecialPlanetTokenLocker is ERC721Holder, MinterRole, SpecialPlanetConstants {
  SpecialPlanetToken public specialPlanetToken;

  mapping(uint24 => uint256) public shortIdToTokenId;

  constructor(address specialPlanetTokenAddress) public {
    specialPlanetToken = SpecialPlanetToken(specialPlanetTokenAddress);
  }

  function mapShortIdToTokenIdAndParseTokenId(uint256 tokenId)
    external
    onlyMinter
    returns (uint24, uint8, uint8, uint64)
  {
    uint24 shortId = uint24(tokenId >> TOKEN_ID_SHORT_ID_START_BIT);
    // uint8 version = uint8(tokenId >> TOKEN_ID_VERSION_START_BIT);
    uint8 kind = uint8(tokenId >> TOKEN_ID_KIND_START_BIT);
    uint8 originalParamCommonLogarithm = uint8(tokenId >> TOKEN_ID_OPCL_START_BIT);
    uint64 artSeed = uint64(tokenId >> TOKEN_ID_ART_SEED_START_BIT);

    shortIdToTokenId[shortId] = tokenId;

    return (shortId, kind, originalParamCommonLogarithm, artSeed);
  }

  function withdraw(uint256 tokenId, address account) public onlyMinter {
    specialPlanetToken.safeTransferFrom(address(this), account, tokenId);
  }

  function withdrawByShortId(uint24 shortId, address account) external onlyMinter {
    withdraw(shortIdToTokenId[shortId], account);
  }

  function extractShortIdFromTokenId(uint256 tokenId) public pure returns (uint24) {
    return uint24(tokenId);
  }
}
