pragma solidity 0.5.11;

contract SpecialPlanetTokenIdInterpretable {
  uint8 constant SHORT_ID_START_BIT = 0;
  uint8 constant VERSION_START_BIT = 24;
  uint8 constant KIND_START_BIT = 24 + 8;
  uint8 constant OPCL_START_BIT = 24 + 8 + 8;
  uint8 constant ART_SEED_START_BIT = 24 + 8 + 8 + 8;

  function interpretSpecialPlanetTokenIdToFields(uint256 tokenId)
    internal
    pure
    returns (uint24, uint8, uint8, uint8, uint64)
  {
    uint24 shortId = uint24(tokenId >> SHORT_ID_START_BIT);
    uint8 version = uint8(tokenId >> VERSION_START_BIT);
    uint8 kind = uint8(tokenId >> KIND_START_BIT);
    uint8 originalParamCommonLogarithm = uint8(tokenId >> OPCL_START_BIT);
    uint64 artSeed = uint64(tokenId >> ART_SEED_START_BIT);

    return (shortId, version, kind, originalParamCommonLogarithm, artSeed);
  }

  function interpretSpecialPlanetTokenFieldsToId(
    uint24 shortId,
    uint8 version,
    uint8 kind,
    uint8 originalParamCommonLogarithm,
    uint64 artSeed
  ) internal pure returns (uint256) {
    return
      (uint256(shortId) << SHORT_ID_START_BIT) |
        (uint256(version) << VERSION_START_BIT) |
        (uint256(kind) << KIND_START_BIT) |
        (uint256(originalParamCommonLogarithm) << OPCL_START_BIT) |
        (uint256(artSeed) << ART_SEED_START_BIT);
  }
}
