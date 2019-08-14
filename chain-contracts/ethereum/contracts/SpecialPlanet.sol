pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Pausable.sol";

contract SpecialPlanet is ERC721Enumerable, ERC721Mintable, ERC721MetadataMintable, ERC721Pausable {
  // TODO: change name
  constructor() public ERC721Metadata("HOGEHOGE", "HOG") {}
}
