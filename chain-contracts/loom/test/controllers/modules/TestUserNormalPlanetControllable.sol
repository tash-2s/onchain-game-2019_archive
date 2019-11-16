pragma solidity 0.5.11;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/UserNormalPlanetControllable.sol";
import "../../../contracts/permanences/UserNormalPlanetPermanence.sol";
import "../../../contracts/permanences/UserNormalPlanetIdGeneratorPermanence.sol";

contract AssertionReporter {
  event TestEvent(bool indexed result, string message);

  function report(bool result, string memory message) public {
    if (result) emit TestEvent(true, "");
    else emit TestEvent(false, message);
  }
}

contract TestUserNormalPlanetControllable is UserNormalPlanetControllable {
  int16 constant INT16_MAX = int16(~(uint16(1) << 15));
  int16 constant INT16_MIN = int16(uint16(1) << 15);

  AssertionReporter private _reporter = new AssertionReporter();
  UserNormalPlanetPermanence private _permanence = new UserNormalPlanetPermanence();
  UserNormalPlanetIdGeneratorPermanence private _icp = new UserNormalPlanetIdGeneratorPermanence();

  function beforeAll() public {
    setUserNormalPlanetPermanence(address(_permanence));
    setUserNormalPlanetIdGeneratorPermanence(address(_icp));
  }

  function testUserNormalPlanetPermanence() public {
    Assert.equal(address(userNormalPlanetPermanence()), address(_permanence), "permanence");

    Assert.equal(
      address(userNormalPlanetIdGeneratorPermanence()),
      address(_icp),
      "id counter permanence"
    );
  }

  function testUserNormalPlanetRecordsOf() public {
    address account = address(1);

    Assert.equal(userNormalPlanetRecordsOf(account).length, 0, "empty");

    _permanence.createElement(account, 10000100000000000000000001);
    _permanence.createElement(account, 20000200000000000000000002);

    Assert.equal(userNormalPlanetRecordsOf(account).length, 2, "added");
    _reporter.report(userNormalPlanetRecordsOf(account)[0].kind == 1, "valid");
  }

  function testUserNormalPlanetRecordsCountOf() public {
    address account = address(2);

    Assert.equal(uint256(userNormalPlanetRecordsCountOf(account)), uint256(0), "initial");
    _permanence.createElement(account, 10000100000000000000000001);
    _permanence.createElement(account, 20000200000000000000000002);
    _permanence.createElement(account, 30000300000000000000000003);
    Assert.equal(uint256(userNormalPlanetRecordsCountOf(account)), uint256(3), "added");
    uint256[] memory a = new uint256[](1);
    a[0] = 10000100001;
    _permanence.update(account, a);
    Assert.equal(uint256(userNormalPlanetRecordsCountOf(account)), uint256(1), "deleted");
  }

  function testUserNormalPlanetRecordOf() public {
    address account = address(3);

    (bool isSuccessed, ) = address(this).call(
      abi.encodeWithSignature("wrappedUserNormalPlanetRecordOf(address,uint16)", account, uint16(1))
    );
    Assert.isFalse(isSuccessed, "no data");

    _permanence.createElement(account, 10000100000000000000000001);
    _permanence.createElement(account, 20000200000000000000000002);
    _permanence.createElement(account, 30000300000000000000000003);

    Assert.equal(uint256(userNormalPlanetRecordOf(account, 2).id), uint256(2), "success");

    (isSuccessed, ) = address(this).call(
      abi.encodeWithSignature("wrappedUserNormalPlanetRecordOf(address,uint16)", account, uint16(4))
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

    // overwrite
    Assert.equal(uint256(userNormalPlanetRecordsCountOf(account)), uint256(2), "2");
    mintUserNormalPlanet(account, 7, 7, 7, 1, -1);
    _assertEqual(
      userNormalPlanetRecordOf(account, 2),
      UserNormalPlanetRecord(2, 7, 7, 7, 1, uint32now(), uint32now(), 1, -1),
      "overwritable"
    );
    Assert.equal(uint256(userNormalPlanetRecordsCountOf(account)), uint256(2), "still 2");
  }

  function testRankupUserNormalPlanet() public {
    address account = address(5);
    _permanence.createElement(account, 10010010000100000000000000000000); // id: 0, rank: 1
    _permanence.createElement(account, 290010010000100000000000000000001); // id: 1, rank: 29

    rankupUserNormalPlanet(account, 0, 2);
    Assert.equal(uint256(userNormalPlanetRecordOf(account, 0).rank), uint256(2), "2");

    rankupUserNormalPlanet(account, 0, 3);
    Assert.equal(uint256(userNormalPlanetRecordOf(account, 0).rank), uint256(3), "3");

    rankupUserNormalPlanet(account, 0, 5);
    Assert.equal(uint256(userNormalPlanetRecordOf(account, 0).rank), uint256(5), "5");

    rankupUserNormalPlanet(account, 1, 30);
    Assert.equal(uint256(userNormalPlanetRecordOf(account, 1).rank), uint256(30), "30");

    (bool isSuccessed, ) = address(this).call(
      abi.encodeWithSignature("wrappedRankupUserNormalPlanet(address,uint64,uint8)", account, 1, 31)
    );
    Assert.isFalse(isSuccessed, "> 30");

    (isSuccessed, ) = address(this).call(
      abi.encodeWithSignature("wrappedRankupUserNormalPlanet(address,uint64,uint8)", account, 2, 7)
    );
    Assert.isFalse(isSuccessed, "no target user planet");
  }

  function testBuildUserNormalPlanetRecordFromUint256() public {
    (bool isSuccessed, ) = address(this).call(
      abi.encodeWithSignature("wrappedBuildUserNormalPlanetRecordFromUint256(uint256)", 0)
    );
    Assert.isFalse(isSuccessed, "0");

    _assertEqual(
      buildUserNormalPlanetRecordFromUint256(10000000000000000000000000),
      UserNormalPlanetRecord(0, 0, 1, 0, 0, 0, 0, 0, 0),
      "kind: 1"
    );

    _assertEqual(
      buildUserNormalPlanetRecordFromUint256(
        10000000000000000900008000000000700000000060050040030000200000000000000000001
      ),
      UserNormalPlanetRecord(1, 2, 3, 4, 5, 6, 7, 8, 9),
      "1 to 9"
    );

    _assertEqual(
      buildUserNormalPlanetRecordFromUint256(
        10000000000003276732767429496729542949672952552552556553518446744073709551615
      ),
      UserNormalPlanetRecord(
        ~uint64(0),
        ~uint16(0),
        ~uint8(0),
        ~uint8(0),
        ~uint8(0),
        ~uint32(0),
        ~uint32(0),
        INT16_MAX,
        INT16_MAX
      ),
      "max"
    );

    _assertEqual(
      buildUserNormalPlanetRecordFromUint256(
        3276865535000000000000000000000000000010000000000000000000000000
      ),
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
      10000000000000000900008000000000700000000060050040030000200000000000000000001,
      "1 to 9"
    );

    Assert.equal(
      buildUint256FromUserNormalPlanetRecord(
        UserNormalPlanetRecord(
          ~uint64(0),
          ~uint16(0),
          ~uint8(0),
          ~uint8(0),
          ~uint8(0),
          ~uint32(0),
          ~uint32(0),
          INT16_MAX,
          INT16_MAX
        )
      ),
      10000000000003276732767429496729542949672952552552556553518446744073709551615,
      "max"
    );

    Assert.equal(
      buildUint256FromUserNormalPlanetRecord(
        UserNormalPlanetRecord(0, 0, 1, 0, 0, 0, 0, -1, INT16_MIN)
      ),
      10000000000003276865535000000000000000000000000000010000000000000000000000000,
      "minus coordinates"
    );
  }

  function _assertEqual(
    UserNormalPlanetRecord memory r1,
    UserNormalPlanetRecord memory r2,
    string memory message
  ) private {
    _reporter.report(
      keccak256(
          abi.encodePacked(
            r1.id,
            r1.normalPlanetId,
            r1.kind,
            r1.originalParamCommonLogarithm,
            r1.rank,
            r1.rankupedAt,
            r1.createdAt,
            r1.coordinateQ,
            r1.coordinateR
          )
        ) ==
        keccak256(
          abi.encodePacked(
            r2.id,
            r2.normalPlanetId,
            r2.kind,
            r2.originalParamCommonLogarithm,
            r2.rank,
            r2.rankupedAt,
            r2.createdAt,
            r2.coordinateQ,
            r2.coordinateR
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
    uint8 paramCommonLogarithm,
    int16 coordinateQ,
    int16 coordinateR
  ) public {
    mintUserNormalPlanet(
      account,
      normalPlanetId,
      kind,
      paramCommonLogarithm,
      coordinateQ,
      coordinateR
    );
  }

  function wrappedRankupUserNormalPlanet(address account, uint64 userPlanetId, uint8 targetRank)
    public
  {
    rankupUserNormalPlanet(account, userPlanetId, targetRank);
  }
}
