pragma solidity 0.5.11;

import "./PermanenceInterpretable.sol";
import "../../permanences/NormalPlanetPermanence.sol";

contract NormalPlanetControllable is PermanenceInterpretable {
  struct NormalPlanetRecord {
    uint8 kind;
    uint8 paramCommonLogarithm;
    uint8 priceGoldCommonLogarithm;
  }

  uint8 constant NORMAL_PLANET_PERMANENCE_KIND_START_DIGIT = 1;
  uint8 constant NORMAL_PLANET_PERMANENCE_KIND_END_DIGIT = 3;
  uint8 constant NORMAL_PLANET_PERMANENCE_PARAM_START_DIGIT = 4;
  uint8 constant NORMAL_PLANET_PERMANENCE_PARAM_END_DIGIT = 6;
  uint8 constant NORMAL_PLANET_PERMANENCE_PRICE_GOLD_COMMON_LOGARITHM_START_DIGIT = 7;
  uint8 constant NORMAL_PLANET_PERMANENCE_PRICE_GOLD_COMMON_LOGARITHM_END_DIGIT = 9;

  NormalPlanetPermanence private _normalPlanetPermanence;

  function normalPlanetPermanence() public view returns (NormalPlanetPermanence) {
    return _normalPlanetPermanence;
  }

  function setNormalPlanetPermanence(address permanenceAddress) internal {
    _normalPlanetPermanence = NormalPlanetPermanence(permanenceAddress);
  }

  function normalPlanetRecordOf(uint16 id) internal view returns (NormalPlanetRecord) {
    return buildNormalPlanetRecordFromUint256(_normalPlanetPermanence.read(id));
  }

  function buildNormalPlanetRecordFromUint256(uint256 source)
    internal
    pure
    returns (NormalPlanetRecord)
  {
    uint8 kind = uint8(
      interpretPermanenceUint256(
        source,
        NORMAL_PLANET_PERMANENCE_KIND_START_DIGIT,
        NORMAL_PLANET_PERMANENCE_KIND_END_DIGIT
      )
    );
    uint8 paramCommonLogarithm = uint8(
      interpretPermanenceUint256(
        source,
        NORMAL_PLANET_PERMANENCE_PARAM_START_DIGIT,
        NORMAL_PLANET_PERMANENCE_PARAM_END_DIGIT
      )
    );
    uint8 priceGoldCommonLogarithm = uint8(
      interpretPermanenceUint256(
        source,
        NORMAL_PLANET_PERMANENCE_PRICE_GOLD_COMMON_LOGARITHM_START_DIGIT,
        NORMAL_PLANET_PERMANENCE_PRICE_GOLD_COMMON_LOGARITHM_END_DIGIT
      )
    );

    if (kind == 0 && paramCommonLogarithm == 0 && priceGoldCommonLogarithm == 0) {
      revert("faild to build a planet record, the source is wrong");
    }

    return NormalPlanetRecord(kind, paramCommonLogarithm, priceGoldCommonLogarithm);
  }
}
