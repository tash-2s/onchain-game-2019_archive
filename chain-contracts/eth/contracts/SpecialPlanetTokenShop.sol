pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./SpecialPlanetToken.sol";
import "./SpecialPlanetTokenShortIdGenerator.sol";

import "../../SpecialPlanetTokenConstants.sol";

contract SpecialPlanetTokenShop is SpecialPlanetTokenConstants, MinterRole {
  using SafeMath for uint256;

  SpecialPlanetToken public specialPlanetToken;
  SpecialPlanetTokenShortIdGenerator public specialPlanetTokenShortIdGenerator;
  uint256 public price = 100000000000000000; // 0.1 eth
  bytes32 private _s;

  constructor(address specialPlanetTokenAddress, address specialPlanetTokenShortIdGeneratorAddress)
    public
  {
    specialPlanetToken = SpecialPlanetToken(specialPlanetTokenAddress);
    specialPlanetTokenShortIdGenerator = SpecialPlanetTokenShortIdGenerator(
      specialPlanetTokenShortIdGeneratorAddress
    );
  }

  function sell() external payable returns (uint256) {
    require(msg.value >= price, "shop: insufficient eth");
    price = price.add(price / 100);

    uint24 shortId = specialPlanetTokenShortIdGenerator.next();

    uint256 seed = uint256(_nextUnsafeSeed());

    uint8 version = 1;
    uint8 kind = (uint8(seed) % 2) + 1; // 1 or 2
    uint8 originalParamCommonLogarithm = 40;
    uint64 artSeed = uint64(seed >> 8);

    uint256 id = (uint256(shortId) << TOKEN_ID_SHORT_ID_START_BIT) |
      (uint256(version) << TOKEN_ID_VERSION_START_BIT) |
      (uint256(kind) << TOKEN_ID_KIND_START_BIT) |
      (uint256(originalParamCommonLogarithm) << TOKEN_ID_OPCL_START_BIT) |
      (uint256(artSeed) << TOKEN_ID_ART_SEED_START_BIT);

    specialPlanetToken.mint(msg.sender, id);
    return id;
  }

  // this is not secure, but enough for my use case, for now.
  function _nextUnsafeSeed() private returns (bytes32) {
    _s = keccak256(abi.encodePacked(blockhash(block.number - 1), block.coinbase, _s));
    return _s;
  }

  function withdrawSales() public onlyMinter {
    msg.sender.transfer(address(this).balance);
  }
}
