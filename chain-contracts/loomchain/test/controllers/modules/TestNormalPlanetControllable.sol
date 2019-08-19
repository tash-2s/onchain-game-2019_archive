pragma solidity 0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

import "../../../contracts/controllers/modules/NormalPlanetControllable.sol";

contract AssertionReporter {
  // this event will be captured by truffle, see Assert.sol of truffle
  event TestEvent(bool indexed result, string message);

  function report(bool result, string message) public {
    if (result) emit TestEvent(true, "");
    else emit TestEvent(false, message);
  }
}

contract TestNormalPlanetControllable is NormalPlanetControllable {
  AssertionReporter private _reporter = new AssertionReporter();

  function beforeAll() public {
    setNormalPlanetPermanence(DeployedAddresses.NormalPlanetPermanence());
  }

  function testNormalPlanetPermanence() public {
    Assert.equal(
      normalPlanetPermanence(),
      DeployedAddresses.NormalPlanetPermanence(),
      "#normalPlanetPermanence()"
    );
  }

  function testNormalPlanetRecordOf() public {
    _assertEqual(normalPlanetRecordOf(1), NormalPlanetRecord(1, 1, 3), "#normalPlanetRecordOf(1)");
  }

  function testBuildNormalPlanetRecordFromUint256() public {
    bool isSuccessed = address(this).call(
      bytes4(keccak256("wrappedBuildNormalPlanetRecordFromUint256(uint256)")),
      0
    );
    Assert.isFalse(isSuccessed, "0 should fail");

    _assertEqual(
      buildNormalPlanetRecordFromUint256(
        10000000000000000000000000000000000000000000000000000000000000000000005010003
      ),
      NormalPlanetRecord(3, 10, 5),
      "dummy data"
    );
    _assertEqual(
      buildNormalPlanetRecordFromUint256(
        10000000000000000000000000000000000000000000000000000000000000000000255255255
      ),
      NormalPlanetRecord(~uint8(0), ~uint8(0), ~uint8(0)),
      "maximum params data"
    );
  }

  function _assertEqual(NormalPlanetRecord r1, NormalPlanetRecord r2, string message) private {
    _reporter.report(
      r1.kind == r2.kind &&
        r1.paramCommonLogarithm == r2.paramCommonLogarithm &&
        r1.priceGoldCommonLogarithm == r2.priceGoldCommonLogarithm,
      message
    );
  }

  // make #buildNormalPlanetRecordFromUint256() public
  function wrappedBuildNormalPlanetRecordFromUint256(uint256 source) public pure {
    buildNormalPlanetRecordFromUint256(source);
  }
}
