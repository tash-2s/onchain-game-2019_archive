pragma solidity 0.4.24;

import "./PermanenceInterpretable.sol";
import "../permanences/NormalPlanetPermanence.sol";

contract NormalPlanetControllable is PermanenceInterpretable {
  struct NormalPlanetRecord {
    uint8 kind;
    uint16 param;
    uint200 priceGold;
  }

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
    uint8 kind = uint8(interpretPermanenceUint256(source, 1, 3));
    uint16 param = uint16(interpretPermanenceUint256(source, 4, 8));
    uint200 priceGold = uint200(interpretPermanenceUint256(source, 9, 69));

    if (kind == 0) {
      revert("faild to build planet, it's not defined");
    }

    return NormalPlanetRecord(kind, param, priceGold);
  }
}
