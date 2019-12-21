pragma solidity 0.5.13;

import "../../permanences/InGameAsteriskPermanence.sol";

contract InGameAsteriskControllable {
  struct InGameAsteriskRecord {
    uint16 id;
    uint8 kind;
    uint8 paramCommonLogarithm;
    uint8 priceGoldCommonLogarithm;
  }

  // id is the key of permanence data
  uint8 private constant _P_KIND_SHIFT_COUNT = 0;
  uint8 private constant _P_PARAM_SHIFT_COUNT = _P_KIND_SHIFT_COUNT + 8;
  uint8 private constant _P_PRICE_SHIFT_COUNT = _P_PARAM_SHIFT_COUNT + 8;

  InGameAsteriskPermanence public inGameAsteriskPermanence;

  function inGameAsteriskRecordOf(uint16 id) internal view returns (InGameAsteriskRecord memory) {
    InGameAsteriskRecord memory record = buildInGameAsteriskRecord(
      id,
      inGameAsteriskPermanence.read(id)
    );

    require(record.kind != 0, "inGame asterisk: not found");

    return record;
  }

  function buildInGameAsteriskRecord(uint16 id, bytes32 b)
    internal
    pure
    returns (InGameAsteriskRecord memory)
  {
    uint256 ui = uint256(b);

    InGameAsteriskRecord memory record = InGameAsteriskRecord(
      id,
      uint8(ui >> _P_KIND_SHIFT_COUNT),
      uint8(ui >> _P_PARAM_SHIFT_COUNT),
      uint8(ui >> _P_PRICE_SHIFT_COUNT)
    );

    return record;
  }
}
