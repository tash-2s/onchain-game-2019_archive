pragma solidity 0.5.13;

import "@openzeppelin/contracts/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Metadata.sol";
import "@openzeppelin/contracts/drafts/Strings.sol";

contract SpecialPlanetTokenMetadata is ERC165, ERC721, WhitelistedRole, IERC721Metadata {
  /*
   *     bytes4(keccak256('name()')) == 0x06fdde03
   *     bytes4(keccak256('symbol()')) == 0x95d89b41
   *     bytes4(keccak256('tokenURI(uint256)')) == 0xc87b56dd
   *
   *     => 0x06fdde03 ^ 0x95d89b41 ^ 0xc87b56dd == 0x5b5e139f
   */
  bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

  // TODO: change this address or make empty
  string public tokenURIPrefix = "https://d3fivknrylrhff.cloudfront.net/special-planet-token-jsons/";
  string public tokenURISuffix = ".json";

  constructor() public {
    _registerInterface(_INTERFACE_ID_ERC721_METADATA);
  }

  // TODO: change name
  function name() external view returns (string memory) {
    return "HOGEHOGE";
  }

  function symbol() external view returns (string memory) {
    return "HOG";
  }

  function tokenURI(uint256 tokenId) external view returns (string memory) {
    require(_exists(tokenId), "URI query for nonexistent token");

    return string(abi.encodePacked(tokenURIPrefix, Strings.fromUint256(tokenId), tokenURISuffix));
  }

  function updateTokenURIAffixes(string calldata prefix, string calldata suffix)
    external
    onlyWhitelisted
  {
    tokenURIPrefix = prefix;
    tokenURISuffix = suffix;
  }
}

import "@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract SpecialPlanetTokenBase is
  SpecialPlanetTokenMetadata,
  ERC721Enumerable,
  ERC721Burnable,
  Ownable
{
  // inclusive range
  function tokensOfOwnerByIndex(address owner, uint256 startIndex, uint256 endIndex)
    external
    view
    returns (uint256[] memory)
  {
    uint256 size = endIndex.sub(startIndex).add(1);
    uint256[] memory tokenIds = new uint256[](size);

    for (uint256 i = 0; i < size; i++) {
      tokenIds[i] = tokenOfOwnerByIndex(owner, startIndex.add(i));
    }

    return tokenIds;
  }
}
