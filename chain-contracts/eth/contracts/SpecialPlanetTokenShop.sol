pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "./SpecialPlanetToken.sol";
import "./SpecialPlanetTokenShortIdGenerator.sol";

import "../../SpecialPlanetTokenIdInterpretable.sol";

contract SpecialPlanetTokenShop is SpecialPlanetTokenIdInterpretable, MinterRole {
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
    uint8 paramRate = 15;
    uint64 artSeed = uint64(seed >> 8);

    uint256 id = interpretSpecialPlanetTokenFieldsToId(shortId, version, kind, paramRate, artSeed);

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
