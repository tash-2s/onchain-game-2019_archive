pragma solidity 0.4.24;

import "./PermanenceInterpretable.sol";
import "../../permanences/NormalPlanetPermanence.sol";

contract NormalPlanetControllable is PermanenceInterpretable {
  struct NormalPlanetRecord {
    uint8 kind;
    uint16 param;
    uint200 priceGold;
  }

  uint8 constant NORMAL_PLANET_PERMANENCE_KIND_START_DIGIT = 1;
  uint8 constant NORMAL_PLANET_PERMANENCE_KIND_END_DIGIT = 3;
  uint8 constant NORMAL_PLANET_PERMANENCE_PARAM_START_DIGIT = 4;
  uint8 constant NORMAL_PLANET_PERMANENCE_PARAM_END_DIGIT = 8;
  uint8 constant NORMAL_PLANET_PERMANENCE_PRICE_GOLD_START_DIGIT = 9;
  uint8 constant NORMAL_PLANET_PERMANENCE_PRICE_GOLD_END_DIGIT = 69;

  NormalPlanetPermanence private _normalPlanetPermanence;

  function normalPlanetPermanence() public view returns (NormalPlanetPermanence) {
    return _normalPlanetPermanence;
  }

  function setNormalPlanetPermanence(address permanenceAddress) internal {
    _normalPlanetPermanence = NormalPlanetPermanence(permanenceAddress);
  }

  function normalPlanetRecordOf(uint16 id) internal view returns (NormalPlanetRecord) {
    return buildNormalPlanetRecord(_normalPlanetPermanence.read(id));
  }

  function buildNormalPlanetRecord(uint256 source) internal pure returns (NormalPlanetRecord) {
    uint8 kind = uint8(
      interpretPermanenceUint256(
        source,
        NORMAL_PLANET_PERMANENCE_KIND_START_DIGIT,
        NORMAL_PLANET_PERMANENCE_KIND_END_DIGIT
      )
    );
    uint16 param = uint16(
      interpretPermanenceUint256(
        source,
        NORMAL_PLANET_PERMANENCE_PARAM_START_DIGIT,
        NORMAL_PLANET_PERMANENCE_PARAM_END_DIGIT
      )
    );
    uint200 priceGold = uint200(
      interpretPermanenceUint256(
        source,
        NORMAL_PLANET_PERMANENCE_PRICE_GOLD_START_DIGIT,
        NORMAL_PLANET_PERMANENCE_PRICE_GOLD_END_DIGIT
      )
    );

    if (kind == 0) {
      revert("faild to build planet, it's not defined");
    }

    return NormalPlanetRecord(kind, param, priceGold);
  }
}
