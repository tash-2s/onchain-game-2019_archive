pragma solidity 0.5.13;

import "@openzeppelin/contracts/token/ERC721/ERC721Holder.sol";
import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";

import "../tokens/TradableAsteriskToken.sol";

import "../libraries/TradableAsteriskTokenIdInterpreter.sol";

contract TradableAsteriskTokenLocker is ERC721Holder, WhitelistedRole {
  TradableAsteriskToken public tradableAsteriskToken;

  mapping(uint24 => uint256) public shortIdToTokenId;
  mapping(uint256 => address) public tokenIdToOwner;

  constructor(address tradableAsteriskTokenAddress) public {
    tradableAsteriskToken = TradableAsteriskToken(tradableAsteriskTokenAddress);
  }

  // need token's approval
  function lock(address _owner, uint256 tokenId) external onlyWhitelisted {
    address owner = tradableAsteriskToken.ownerOf(tokenId);
    require(owner == _owner, "locker: wrong owner");

    tradableAsteriskToken.safeTransferFrom(owner, address(this), tokenId);

    (uint24 shortId, , , , ) = TradableAsteriskTokenIdInterpreter.idToFields(tokenId);

    shortIdToTokenId[shortId] = tokenId;
    tokenIdToOwner[tokenId] = owner;
  }

  function unlock(address _owner, uint24 shortId) external onlyWhitelisted {
    uint256 tokenId = shortIdToTokenId[shortId];
    address owner = tokenIdToOwner[tokenId];

    require(tokenId != 0 && owner != address(0) && owner == _owner, "locker: wrong owner or id");

    tradableAsteriskToken.safeTransferFrom(address(this), owner, tokenId);
    delete tokenIdToOwner[tokenId];
  }
}
