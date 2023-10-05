pragma solidity 0.5.13;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/InGameAsteriskControllable.sol";

contract TestInGameAsteriskControllable is InGameAsteriskControllable {
  function beforeEach() public {
    inGameAsteriskPermanence = new InGameAsteriskPermanence();
    inGameAsteriskPermanence.addWhitelisted(address(this));
    inGameAsteriskPermanence.update(
      1,
      0x0000000000000000000000000000000000000000000000000000000000040302
    );
  }

  function testInGameAsteriskRecordOf() public {
    _assertEqual(inGameAsteriskRecordOf(1), InGameAsteriskRecord(1, 2, 3, 4), "(1)");
    _expectRevert(abi.encodeWithSignature("publishedInGameAsteriskRecordOf(uint16)", 2), "(2)");
  }

  function testBuildInGameAsteriskRecord() public {
    _assertEqual(
      buildInGameAsteriskRecord(
        1,
        0x0000000000000000000000000000000000000000000000000000000000040302
      ),
      InGameAsteriskRecord(1, 2, 3, 4),
      "(1, 2, 3, 4)"
    );
    _assertEqual(
      buildInGameAsteriskRecord(
        2,
        0x0000000000000000000000000000000000000000000000000000000000ffffff
      ),
      InGameAsteriskRecord(2, ~uint8(0), ~uint8(0), ~uint8(0)),
      "(2, ~uint8(0), ~uint8(0), ~uint8(0))"
    );
  }

  function _assertEqual(
    InGameAsteriskRecord memory r1,
    InGameAsteriskRecord memory r2,
    string memory message
  ) private {
    Assert.equal(
      keccak256(
        abi.encodePacked(r1.id, r1.kind, r1.paramCommonLogarithm, r1.priceGoldCommonLogarithm)
      ),
      keccak256(
        abi.encodePacked(r2.id, r2.kind, r2.paramCommonLogarithm, r2.priceGoldCommonLogarithm)
      ),
      message
    );
  }

  function _expectRevert(bytes memory encoded, string memory message) private {
    (bool isSuccess, ) = address(this).call(encoded);
    Assert.isFalse(isSuccess, message);
  }

  function publishedInGameAsteriskRecordOf(uint16 id) public view {
    inGameAsteriskRecordOf(id);
  }
}
