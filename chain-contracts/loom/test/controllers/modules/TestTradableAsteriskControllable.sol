pragma solidity 0.5.13;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/TradableAsteriskControllable.sol";

contract TestTradableAsteriskControllable is TradableAsteriskControllable {
  function beforeEach() public {
    userTradableAsteriskPermanence = new UserTradableAsteriskPermanence();
    tradableAsteriskIdToDataPermanence = new TradableAsteriskIdToDataPermanence();
  }

  function testBuildUserTradableAsteriskRecordFromBytes32() public {
    _assertEqual(
      buildUserTradableAsteriskRecordFromBytes32(
        0x0000000000000000000000000a00090008000000070000000605040302000001
      ),
      UserTradableAsteriskRecord(1, 2, 3, 4, 5, 6, 7, 8, 9, 10),
      "1 to 10"
    );
  }

  function testBuildBytes32FromUserTradableAsteriskRecord() public {
    Assert.equal(
      buildBytes32FromUserTradableAsteriskRecord(
        UserTradableAsteriskRecord(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
      ),
      0x0000000000000000000000000a00090008000000070000000605040302000001,
      "1 to 10"
    );
    Assert.equal(
      buildBytes32FromUserTradableAsteriskRecord(
        UserTradableAsteriskRecord(
          16777215,
          255,
          255,
          255,
          255,
          4294967295,
          4294967295,
          -1,
          -1,
          18446744073709551615
        )
      ),
      0x0000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffff,
      "max"
    );
  }

  function _assertEqual(
    UserTradableAsteriskRecord memory r1,
    UserTradableAsteriskRecord memory r2,
    string memory message
  ) private {
    Assert.equal(
      keccak256(
        abi.encodePacked(
          r1.id,
          r1.version,
          r1.kind,
          r1.paramRate,
          r1.rank,
          r1.rankupedAt,
          r1.createdAt,
          r1.coordinateQ,
          r1.coordinateR,
          r1.artSeed
        )
      ),
      keccak256(
        abi.encodePacked(
          r2.id,
          r2.version,
          r2.kind,
          r2.paramRate,
          r2.rank,
          r2.rankupedAt,
          r2.createdAt,
          r2.coordinateQ,
          r2.coordinateR,
          r2.artSeed
        )
      ),
      message
    );
  }
}
