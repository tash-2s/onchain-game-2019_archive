pragma solidity 0.5.11;

import "../../permanences/NormalPlanetPermanence.sol";

contract NormalPlanetControllable {
  struct NormalPlanetRecord {
    uint16 id;
    uint8 kind;
    uint8 paramCommonLogarithm;
    uint8 priceGoldCommonLogarithm;
  }

  // id is the key of permanence data
  uint8 private constant _P_KIND_SHIFT_COUNT = 0;
  uint8 private constant _P_PARAM_SHIFT_COUNT = _P_KIND_SHIFT_COUNT + 8;
  uint8 private constant _P_PRICE_SHIFT_COUNT = _P_PARAM_SHIFT_COUNT + 8;

  NormalPlanetPermanence public normalPlanetPermanence;

  function normalPlanetRecordOf(uint16 id) internal view returns (NormalPlanetRecord memory) {
    return buildNormalPlanetRecord(id, normalPlanetPermanence.read(id));
  }

  function buildNormalPlanetRecord(uint16 id, bytes32 b)
    internal
    pure
    returns (NormalPlanetRecord memory)
  {
    uint256 ui = uint256(b);

    NormalPlanetRecord memory record = NormalPlanetRecord(
      id,
      uint8(ui >> _P_KIND_SHIFT_COUNT),
      uint8(ui >> _P_PARAM_SHIFT_COUNT),
      uint8(ui >> _P_PRICE_SHIFT_COUNT)
    );

    if (
      record.kind == 0 && record.paramCommonLogarithm == 0 && record.priceGoldCommonLogarithm == 0
    ) {
      revert("faild to build a planet record, the source is wrong");
    }

    return record;
  }
}
