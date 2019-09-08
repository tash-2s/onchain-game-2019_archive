pragma solidity 0.5.11;

import "@openzeppelin/contracts/introspection/ERC165.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/roles/MinterRole.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Metadata.sol";

contract SpecialPlanetTokenMetadata is ERC165, ERC721, MinterRole, IERC721Metadata {
  /*
   *     bytes4(keccak256('name()')) == 0x06fdde03
   *     bytes4(keccak256('symbol()')) == 0x95d89b41
   *     bytes4(keccak256('tokenURI(uint256)')) == 0xc87b56dd
   *
   *     => 0x06fdde03 ^ 0x95d89b41 ^ 0xc87b56dd == 0x5b5e139f
   */
  bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

  string public tokenURIPrefix = "https://example.com/";
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

    return _concatStrings(tokenURIPrefix, _uintToString(tokenId), tokenURISuffix);
  }

  function updateBaseURI(string calldata prefix, string calldata suffix) external onlyMinter {
    tokenURIPrefix = prefix;
    tokenURISuffix = suffix;
  }

  function _concatStrings(string memory _a, string memory _b, string memory _c)
    private
    pure
    returns (string memory)
  {
    bytes memory a = bytes(_a);
    bytes memory b = bytes(_b);
    bytes memory c = bytes(_c);

    bytes memory abc = bytes(new string(a.length + b.length + c.length));
    uint256 k = 0;

    for (uint256 i = 0; i < a.length; i++) abc[k++] = a[i];
    for (uint256 i = 0; i < b.length; i++) abc[k++] = b[i];
    for (uint256 i = 0; i < c.length; i++) abc[k++] = c[i];

    return string(abc);
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
