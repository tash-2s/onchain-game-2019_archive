pragma solidity 0.5.11;

contract SpecialPlanetTokenIdInterpretable {
  uint8 private constant _SHORT_ID_SHIFT_COUNT = 0;
  uint8 private constant _VERSION_SHIFT_COUNT = _SHORT_ID_SHIFT_COUNT + 24;
  uint8 private constant _KIND_SHIFT_COUNT = _VERSION_SHIFT_COUNT + 8;
  uint8 private constant _PARAM_RATE_SHIFT_COUNT = _KIND_SHIFT_COUNT + 8;
  uint8 private constant _ART_SEED_SHIFT_COUNT = _PARAM_RATE_SHIFT_COUNT + 8;

  function interpretSpecialPlanetTokenIdToFields(uint256 tokenId)
    internal
    pure
    returns (uint24 shortId, uint8 version, uint8 kind, uint8 paramRate, uint64 artSeed)
  {
    shortId = uint24(tokenId >> _SHORT_ID_SHIFT_COUNT);
    version = uint8(tokenId >> _VERSION_SHIFT_COUNT);
    kind = uint8(tokenId >> _KIND_SHIFT_COUNT);
    paramRate = uint8(tokenId >> _PARAM_RATE_SHIFT_COUNT);
    artSeed = uint64(tokenId >> _ART_SEED_SHIFT_COUNT);
  }

  function interpretSpecialPlanetTokenFieldsToId(
    uint24 shortId,
    uint8 version,
    uint8 kind,
    uint8 paramRate,
    uint64 artSeed
  ) internal pure returns (uint256) {
    return
      (uint256(shortId) << _SHORT_ID_SHIFT_COUNT) |
        (uint256(version) << _VERSION_SHIFT_COUNT) |
        (uint256(kind) << _KIND_SHIFT_COUNT) |
        (uint256(paramRate) << _PARAM_RATE_SHIFT_COUNT) |
        (uint256(artSeed) << _ART_SEED_SHIFT_COUNT);
  }
}
