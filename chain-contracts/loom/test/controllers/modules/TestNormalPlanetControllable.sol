pragma solidity 0.5.13;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/NormalPlanetControllable.sol";

contract TestNormalPlanetControllable is NormalPlanetControllable {
  function beforeEach() public {
    normalPlanetPermanence = new NormalPlanetPermanence();
    normalPlanetPermanence.addWhitelisted(address(this));
    normalPlanetPermanence.update(
      1,
      0x0000000000000000000000000000000000000000000000000000000000040302
    );
  }

  function testNormalPlanetRecordOf() public {
    _assertEqual(normalPlanetRecordOf(1), NormalPlanetRecord(1, 2, 3, 4), "(1)");
    _expectRevert(abi.encodeWithSignature("publishedNormalPlanetRecordOf(uint16)", 2), "(2)");
  }

  function testBuildNormalPlanetRecord() public {
    _assertEqual(
      buildNormalPlanetRecord(
        1,
        0x0000000000000000000000000000000000000000000000000000000000040302
      ),
      NormalPlanetRecord(1, 2, 3, 4),
      "(1, 2, 3, 4)"
    );
    _assertEqual(
      buildNormalPlanetRecord(
        2,
        0x0000000000000000000000000000000000000000000000000000000000ffffff
      ),
      NormalPlanetRecord(2, ~uint8(0), ~uint8(0), ~uint8(0)),
      "(2, ~uint8(0), ~uint8(0), ~uint8(0))"
    );
  }

  function _assertEqual(
    NormalPlanetRecord memory r1,
    NormalPlanetRecord memory r2,
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

  function publishedNormalPlanetRecordOf(uint16 id) public view {
    normalPlanetRecordOf(id);
  }
}
