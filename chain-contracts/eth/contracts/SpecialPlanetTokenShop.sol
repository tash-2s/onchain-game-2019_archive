pragma solidity 0.5.13;

import "@openzeppelin/contracts/access/roles/WhitelistedRole.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

import "./SpecialPlanetToken.sol";
import "./SpecialPlanetTokenShortIdGenerator.sol";

import "./SpecialPlanetTokenIdInterpreter.sol";

contract SpecialPlanetTokenShop is WhitelistedRole {
  using SafeMath for uint256;

  SpecialPlanetToken public specialPlanetToken;
  SpecialPlanetTokenShortIdGenerator public specialPlanetTokenShortIdGenerator;
  uint256 public price = 50000000000000000; // 0.05 eth
  bytes32 private _s;

  constructor(address specialPlanetTokenAddress, address specialPlanetTokenShortIdGeneratorAddress)
    public
  {
    specialPlanetToken = SpecialPlanetToken(specialPlanetTokenAddress);
    specialPlanetTokenShortIdGenerator = SpecialPlanetTokenShortIdGenerator(
      specialPlanetTokenShortIdGeneratorAddress
    );
  }

  function mint() external payable returns (uint256) {
    require(!Address.isContract(msg.sender), "shop: not EOA"); // unsafe but enough for this use case
    require(msg.value >= price, "shop: insufficient eth");
    price = price.add(price / 100);

    uint24 shortId = specialPlanetTokenShortIdGenerator.next();

    uint256 seed = uint256(_nextUnsafeSeed()); // enough for this use case

    uint8 version = 1;
    uint8 kind = (uint8(seed) % 2) + 1; // 1 or 2
    uint8 paramRate = 15;
    uint64 artSeed = uint64(seed >> 8);

    uint256 id = SpecialPlanetTokenIdInterpreter.fieldsToId(
      shortId,
      version,
      kind,
      paramRate,
      artSeed
    );

    specialPlanetToken.mint(msg.sender, id);
    return id;
  }

  function withdrawSales() external onlyWhitelisted {
    Address.sendValue(msg.sender, address(this).balance);
  }

  function _nextUnsafeSeed() private returns (bytes32) {
    _s = keccak256(abi.encodePacked(blockhash(block.number - 1), block.coinbase, _s));
    return _s;
  }
}
