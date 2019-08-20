pragma solidity 0.5.11;

import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";

import "../tokens/Erc721SpecialPlanet.sol";

contract Erc721SpecialPlanetLocker is ERC721Holder, MinterRole {
  Erc721SpecialPlanet public erc721SpecialPlanet;

  mapping(uint24 => uint256) public shortIdToTokenId;

  constructor(address erc721SpecialPlanetAddress) public {
    erc721SpecialPlanet = Erc721SpecialPlanet(erc721SpecialPlanetAddress);
  }

  function mapShortIdToTokenIdAndParseTokenId(uint256 tokenId)
    external
    onlyMinter
    returns (uint24, uint8, uint8, uint64)
  {
    // TODO: get them from constants
    uint24 shortId = uint24(tokenId >> 0);
    // uint8 version = uint8(tokenId >> 24);
    uint8 kind = uint8(tokenId >> (24 + 8));
    uint8 originalParamCommonLogarithm = uint8(tokenId >> (24 + 8 + 8));
    uint64 artSeed = uint64(tokenId >> (24 + 8 + 8));

    shortIdToTokenId[shortId] = tokenId;

    return (shortId, kind, originalParamCommonLogarithm, artSeed);
  }

  function withdraw(uint256 tokenId, address account) public onlyMinter {
    erc721SpecialPlanet.safeTransferFrom(address(this), account, tokenId);
  }

  function withdrawByShortId(uint24 shortId, address account) external onlyMinter {
    withdraw(shortIdToTokenId[shortId], account);
  }

  function extractShortIdFromTokenId(uint256 tokenId) public pure returns (uint24) {
    return uint24(tokenId);
  }
}
