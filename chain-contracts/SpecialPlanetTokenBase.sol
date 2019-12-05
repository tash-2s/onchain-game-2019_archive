pragma solidity 0.5.13;

import "@openzeppelin/contracts/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Metadata.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";

contract SpecialPlanetTokenMetadata is ERC165, ERC721, MinterRole, IERC721Metadata {
  /*
   *     bytes4(keccak256('name()')) == 0x06fdde03
   *     bytes4(keccak256('symbol()')) == 0x95d89b41
   *     bytes4(keccak256('tokenURI(uint256)')) == 0xc87b56dd
   *
   *     => 0x06fdde03 ^ 0x95d89b41 ^ 0xc87b56dd == 0x5b5e139f
   */
  bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

  // TODO: change this address
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

    return string(abi.encodePacked(tokenURIPrefix, _uintToString(tokenId), tokenURISuffix));
  }

  function updateTokenURIAffixes(string calldata prefix, string calldata suffix)
    external
    onlyMinter
  {
    tokenURIPrefix = prefix;
    tokenURISuffix = suffix;
  }

  function _uintToString(uint256 value) private pure returns (string memory) {
    if (value == 0) {
      return "0";
    }
    uint256 temp = value;
    uint256 digits;
    while (temp != 0) {
      digits++;
      temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    uint256 index = digits - 1;
    temp = value;
    while (temp != 0) {
      buffer[index--] = bytes1(uint8(48 + (temp % 10)));
      temp /= 10;
    }
    return string(buffer);
  }
}

contract SpecialPlanetTokenBase is
  SpecialPlanetTokenMetadata,
  ERC721Enumerable,
  ERC721Burnable,
  Ownable
{
  uint8 private constant _MAX_TOKEN_BATCH_SIZE = 100;

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
    if (size > _MAX_TOKEN_BATCH_SIZE) {
      size = _MAX_TOKEN_BATCH_SIZE;
      nextIndex = index + _MAX_TOKEN_BATCH_SIZE;
    }

    tokenIds = new uint256[](size);

    for (uint256 i = index; i < (index + size); i++) {
      tokenIds[i] = tokenOfOwnerByIndex(owner, i);
    }

    return (tokenIds, nextIndex);
  }
}
