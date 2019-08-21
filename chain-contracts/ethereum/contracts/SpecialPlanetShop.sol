pragma solidity 0.5.11;

import "@openzeppelin/contracts/access/roles/MinterRole.sol";

import "./SpecialPlanet.sol";
import "./SpecialPlanetShortIdGenerator.sol";

import "../../SpecialPlanetConstants.sol";

contract SpecialPlanetShop is SpecialPlanetConstants, MinterRole {
  SpecialPlanet public specialPlanet;
  SpecialPlanetShortIdGenerator public specialPlanetShortIdGenerator;
  bytes32 private _s;

  constructor(address specialPlanetAddress, address specialPlanetShortIdGeneratorAddress) public {
    specialPlanet = SpecialPlanet(specialPlanetAddress);
    specialPlanetShortIdGenerator = SpecialPlanetShortIdGenerator(
      specialPlanetShortIdGeneratorAddress
    );
  }

  function sell() external payable returns (uint256) {
    require(msg.value >= 100000000000000000, "shop: insufficient eth"); // 0.1 eth

    uint24 shortId = specialPlanetShortIdGenerator.next();

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

    specialPlanet.mint(msg.sender, id);
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
