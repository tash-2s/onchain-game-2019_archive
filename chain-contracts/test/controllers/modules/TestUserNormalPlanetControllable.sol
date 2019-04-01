pragma solidity 0.4.24;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/UserNormalPlanetControllable.sol";
import "../../../contracts/permanences/UserNormalPlanetPermanence.sol";
import "../../../contracts/permanences/UserNormalPlanetIdCounterPermanence.sol";

contract AssertionReporter {
  event TestEvent(bool indexed result, string message);

  function report(bool result, string message) public {
    if (result) emit TestEvent(true, "");
    else emit TestEvent(false, message);
  }
}

contract TestUserNormalPlanetControllable is UserNormalPlanetControllable {
  int16 constant INT16_MAX = int16(~(uint16(1) << 15));
  int16 constant INT16_MIN = int16(uint16(1) << 15);

  AssertionReporter private _reporter = new AssertionReporter();
  UserNormalPlanetPermanence private _permanence = new UserNormalPlanetPermanence();
  UserNormalPlanetIdCounterPermanence private _icp = new UserNormalPlanetIdCounterPermanence();

  function beforeAll() public {
    setUserNormalPlanetPermanence(_permanence);
    setUserNormalPlanetIdCounterPermanence(_icp);
  }

  function testUserNormalPlanetPermanence() public {
    Assert.equal(userNormalPlanetPermanence(), _permanence, "permanence");

    Assert.equal(userNormalPlanetIdCounterPermanence(), _icp, "id counter permanence");
  }

  function testUserNormalPlanetRecordsOf() public {
    address account = address(1);

    Assert.equal(userNormalPlanetRecordsOf(account).length, 0, "empty");

    _permanence.pushElement(account, 10000100001);
    _permanence.pushElement(account, 20000200002);

    Assert.equal(userNormalPlanetRecordsOf(account).length, 2, "added");
    _reporter.report(userNormalPlanetRecordsOf(account)[0].kind == 1, "valid");
  }

  function testUserNormalPlanetRecordsCountOf() public {
    address account = address(2);

    Assert.equal(userNormalPlanetRecordsCountOf(account), 0, "initial");
    _permanence.pushElement(account, 10000100001);
    _permanence.pushElement(account, 20000200002);
    _permanence.pushElement(account, 30000300003);
    Assert.equal(userNormalPlanetRecordsCountOf(account), 3, "added");
    uint256[] memory a = new uint256[](1);
    a[0] = 10000100001;
    _permanence.update(account, a);
    Assert.equal(userNormalPlanetRecordsCountOf(account), 1, "deleted");
  }

  function testUserNormalPlanetRecordOf() public {
    address account = address(3);

    bool isSuccessed = address(this).call(
      bytes4(keccak256("wrappedUserNormalPlanetRecordOf(address,uint16)")),
      account,
      uint16(1)
    );
    Assert.isFalse(isSuccessed, "no data");

    _permanence.pushElement(account, 10000100001);
    _permanence.pushElement(account, 20000200002);
    _permanence.pushElement(account, 30000300003);

    Assert.equal(uint256(userNormalPlanetRecordOf(account, 2).id), uint256(2), "success");

    isSuccessed = address(this).call(
      bytes4(keccak256("wrappedUserNormalPlanetRecordOf(address,uint16)")),
      account,
      uint16(4)
    );
    Assert.isFalse(isSuccessed, "id 4 is not found");
  }

  function testMintUserNormalPlanet() public {
    address account = address(4);

    mintUserNormalPlanet(account, 1, 2, 3, 1, -1);
    mintUserNormalPlanet(account, 1, 2, 3, 100, 0);
    _assertEqual(
      userNormalPlanetRecordOf(account, 0),
      UserNormalPlanetRecord(0, 1, 2, 3, 1, uint32now(), uint32now(), 1, -1),
      "id: 0"
    );
    _assertEqual(
      userNormalPlanetRecordOf(account, 1),
      UserNormalPlanetRecord(1, 1, 2, 3, 1, uint32now(), uint32now(), 100, 0),
      "id: 1"
    );

    bool isSuccessed = address(this).call(
      bytes4(keccak256("wrappedMintUserNormalPlanet(address,uint16,uint8,uint16,int16,int16)")),
      account,
      1,
      2,
      3,
      1,
      -1
    );
    Assert.isFalse(isSuccessed, "same coordinates");
  }

  function testRankupUserNormalPlanet() public {
    address account = address(5);
    _permanence.pushElement(account, 1000010010000100000); // id: 0, rank: 1
    _permanence.pushElement(account, 29000010010000100001); // id: 1, rank: 29

    rankupUserNormalPlanet(account, 0);
    Assert.equal(uint(userNormalPlanetRecordOf(account, 0).rank), uint(2), "2");

    rankupUserNormalPlanet(account, 0);
    Assert.equal(uint(userNormalPlanetRecordOf(account, 0).rank), uint(3), "3");

    rankupUserNormalPlanet(account, 1);
    Assert.equal(uint(userNormalPlanetRecordOf(account, 1).rank), uint(30), "30");

    bool isSuccessed = address(this).call(
      bytes4(keccak256("wrappedRankupUserNormalPlanet(address,uint16)")),
      account,
      1
    );
    Assert.isFalse(isSuccessed, "> 30");

    isSuccessed = address(this).call(
      bytes4(keccak256("wrappedRankupUserNormalPlanet(address,uint16)")),
      account,
      2
    );
    Assert.isFalse(isSuccessed, "no target user planet");
  }

  function testBuildUserNormalPlanetRecordFromUint256() public {
    bool isSuccessed = address(this).call(
      bytes4(keccak256("wrappedBuildUserNormalPlanetRecordFromUint256(uint256)")),
      0
    );
    Assert.isFalse(isSuccessed, "0");

    _assertEqual(
      buildUserNormalPlanetRecordFromUint256(10000000000),
      UserNormalPlanetRecord(0, 0, 1, 0, 0, 0, 0, 0, 0),
      "kind: 1"
    );

    _assertEqual(
      buildUserNormalPlanetRecordFromUint256(
        10000000000000000000000000000090000800000000070000000006005000040030000200001
      ),
      UserNormalPlanetRecord(1, 2, 3, 4, 5, 6, 7, 8, 9),
      "1 to 9"
    );

    _assertEqual(
      buildUserNormalPlanetRecordFromUint256(
        10000000000000000000000000327673276742949672954294967295255655352556553565535
      ),
      UserNormalPlanetRecord(
        ~uint16(0),
        ~uint16(0),
        ~uint8(0),
        ~uint16(0),
        ~uint8(0),
        ~uint32(0),
        ~uint32(0),
        INT16_MAX,
        INT16_MAX
      ),
      "max"
    );

    _assertEqual(
      buildUserNormalPlanetRecordFromUint256(327686553500000000000000000000000000000010000000000),
      UserNormalPlanetRecord(0, 0, 1, 0, 0, 0, 0, -1, INT16_MIN),
      "minus coordinates"
    );
  }

  function testBuildUint256FromUserNormalPlanetRecord() public {
    Assert.equal(
      buildUint256FromUserNormalPlanetRecord(UserNormalPlanetRecord(0, 0, 0, 0, 0, 0, 0, 0, 0)),
      10000000000000000000000000000000000000000000000000000000000000000000000000000,
      "0"
    );

    Assert.equal(
      buildUint256FromUserNormalPlanetRecord(UserNormalPlanetRecord(1, 2, 3, 4, 5, 6, 7, 8, 9)),
      10000000000000000000000000000090000800000000070000000006005000040030000200001,
      "1 to 9"
    );

    Assert.equal(
      buildUint256FromUserNormalPlanetRecord(
        UserNormalPlanetRecord(
          ~uint16(0),
          ~uint16(0),
          ~uint8(0),
          ~uint16(0),
          ~uint8(0),
          ~uint32(0),
          ~uint32(0),
          INT16_MAX,
          INT16_MAX
        )
      ),
      10000000000000000000000000327673276742949672954294967295255655352556553565535,
      "max"
    );

    Assert.equal(
      buildUint256FromUserNormalPlanetRecord(
        UserNormalPlanetRecord(0, 0, 1, 0, 0, 0, 0, -1, INT16_MIN)
      ),
      10000000000000000000000000327686553500000000000000000000000000000010000000000,
      "minus coordinates"
    );
  }

  function _assertEqual(UserNormalPlanetRecord r1, UserNormalPlanetRecord r2, string message)
    private
  {
    _reporter.report(
      keccak256(
        abi.encodePacked(
          r1.id,
          r1.normalPlanetId,
          r1.kind,
          r1.originalParam,
          r1.rank,
          r1.rankupedAt,
          r1.createdAt,
          r1.axialCoordinateQ,
          r1.axialCoordinateR
        )
      ) == keccak256(
        abi.encodePacked(
          r2.id,
          r2.normalPlanetId,
          r2.kind,
          r2.originalParam,
          r2.rank,
          r2.rankupedAt,
          r2.createdAt,
          r2.axialCoordinateQ,
          r2.axialCoordinateR
        )
      ),
      message
    );
  }

  // make #userNormalPlanetRecordOf() public
  function wrappedUserNormalPlanetRecordOf(address account, uint16 userPlanetId) public view {
    userNormalPlanetRecordOf(account, userPlanetId);
  }

  function wrappedBuildUserNormalPlanetRecordFromUint256(uint256 source) public pure {
    buildUserNormalPlanetRecordFromUint256(source);
  }

  function wrappedMintUserNormalPlanet(
    address account,
    uint16 normalPlanetId,
    uint8 kind,
    uint16 param,
    int16 axialCoordinateQ,
    int16 axialCoordinateR
  ) public {
    mintUserNormalPlanet(account, normalPlanetId, kind, param, axialCoordinateQ, axialCoordinateR);
  }

  function wrappedRankupUserNormalPlanet(address account, uint16 userPlanetId) public {
    rankupUserNormalPlanet(account, userPlanetId);
  }
}
