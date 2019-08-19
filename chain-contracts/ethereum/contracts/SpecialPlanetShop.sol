pragma solidity 0.4.24;

import "./SpecialPlanet.sol";

contract SpecialPlanetShop {
  uint24 constant UINT24_MAX = ~uint24(0);

  uint8 constant ID_VERSION_START_BIT = 0;
  uint8 constant ID_SHORT_ID_START_BIT = 8;
  uint8 constant ID_KIND_START_BIT = 8 + 24;
  uint8 constant ID_OPCL_START_BIT = 8 + 24 + 8;
  uint8 constant ID_ART_SEED_START_BIT = 8 + 24 + 8 + 8;

  SpecialPlanet public specialPlanet;
  uint256 public shortIdGenerator;
  bytes32 private _s;

  constructor(address specialPlanetAddress) public {
    specialPlanet = SpecialPlanet(specialPlanetAddress);
  }

  // TODO: get eth
  function sell() external returns (uint256) {
    shortIdGenerator++;
    require(shortIdGenerator <= UINT24_MAX, "short id is too big");

    bytes32 seed = _nextUnsafeSeed();

    uint8 version = 1;
    uint8 kind = (uint8(seed) % 2) + 1; // 1 or 2
    uint8 originalParamCommonLogarithm = 40;
    uint64 artSeed = uint64(seed >> 8);

    uint256 id = (uint256(version) << ID_VERSION_START_BIT) |
      (uint256(shortIdGenerator) << ID_SHORT_ID_START_BIT) |
      (uint256(kind) << ID_KIND_START_BIT) |
      (uint256(originalParamCommonLogarithm) << ID_OPCL_START_BIT) |
      (uint256(artSeed) << ID_ART_SEED_START_BIT);

    specialPlanet.mint(msg.sender, id);
    return id;
  }

  // this is not secure, but enough for my use case, for now.
  function _nextUnsafeSeed() private returns (bytes32) {
    _s = keccak256(abi.encodePacked(blockhash(block.number - 1), block.coinbase, _s));
    return _s;
  }
}
