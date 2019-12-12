pragma solidity 0.5.13;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/UserNormalPlanetControllable.sol";

contract TestUserNormalPlanetControllable is UserNormalPlanetControllable {
  int16 constant INT16_MAX = int16(~(uint16(1) << 15));
  int16 constant INT16_MIN = int16(uint16(1) << 15);

  function beforeEach() public {
    userNormalPlanetPermanence = new UserNormalPlanetPermanence();
    userNormalPlanetPermanence.addWhitelisted(address(this));
  }

  function testUserNormalPlanetRecordsOf() public {
    address account = address(1);

    Assert.equal(userNormalPlanetRecordsOf(account).length, 0, "empty");

    userNormalPlanetPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000100010000000000000001
    );
    userNormalPlanetPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000200020000000000000002
    );

    Assert.equal(userNormalPlanetRecordsOf(account).length, 2, "added");
    Assert.equal(uint256(userNormalPlanetRecordsOf(account)[0].kind), 1, "valid");
  }

  function testUserNormalPlanetRecordsCountOf() public {
    address account = address(1);

    Assert.equal(userNormalPlanetRecordsCountOf(account), 0, "0");

    userNormalPlanetPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000100010000000000000001
    );
    userNormalPlanetPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000200020000000000000002
    );

    Assert.equal(userNormalPlanetRecordsCountOf(account), 2, "2");
  }

  function testUserNormalPlanetRecordOf() public {
    address account = address(1);

    _expectRevert(
      abi.encodeWithSignature(
        "publishedUserNormalPlanetRecordOf(address,uint16)",
        account,
        uint16(1)
      ),
      "(account, 1)"
    );

    userNormalPlanetPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000100010000000000000001
    );
    userNormalPlanetPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000200020000000000000002
    );

    Assert.equal(uint256(userNormalPlanetRecordOf(account, 2).id), uint256(2), "(account, 2)");

    _expectRevert(
      abi.encodeWithSignature(
        "publishedUserNormalPlanetRecordOf(address,uint16)",
        account,
        uint16(3)
      ),
      "(account, 3)"
    );
  }

  function testSetNormalPlanetToMap() public {
    address account = address(1);

    setNormalPlanetToMap(account, 1, 1, 1, 1, 1, -1);
    setNormalPlanetToMap(account, 2, 2, 2, 2, 100, 0);
    _assertEqual(
      userNormalPlanetRecordOf(account, 1),
      UserNormalPlanetRecord(1, 1, 1, 1, 1, Time.uint32now(), Time.uint32now(), 1, -1),
      "id: 1"
    );
    _assertEqual(
      userNormalPlanetRecordOf(account, 2),
      UserNormalPlanetRecord(2, 2, 2, 2, 1, Time.uint32now(), Time.uint32now(), 100, 0),
      "id: 2"
    );
  }

  function testRankupUserNormalPlanet() public {
    address account = address(1);

    setNormalPlanetToMap(account, 1, 1, 1, 1, 1, 1);
    UserNormalPlanetRecord memory record = userNormalPlanetRecordOf(account, 1);

    rankupUserNormalPlanet(account, record, 0, 2);
    Assert.equal(uint256(userNormalPlanetRecordOf(account, 1).rank), uint256(2), "2");

    rankupUserNormalPlanet(account, record, 0, 30);
    Assert.equal(uint256(userNormalPlanetRecordOf(account, 1).rank), uint256(30), "30");
  }

  function testBuildUserNormalPlanetRecordFromBytes32() public {
    _assertEqual(
      buildUserNormalPlanetRecordFromBytes32(
        0x0000000000000000000000000000000000000000000100010000000000000001
      ),
      UserNormalPlanetRecord(1, 1, 1, 0, 0, 0, 0, 0, 0),
      "kind: 1"
    );

    _assertEqual(
      buildUserNormalPlanetRecordFromBytes32(
        0x000000000000008000ffff000000000000000000000100000000000000000000
      ),
      UserNormalPlanetRecord(0, 0, 1, 0, 0, 0, 0, -1, INT16_MIN),
      "minus coordinates"
    );
  }

  function testBuildBytes32FromUserNormalPlanetRecord() public {
    Assert.equal(
      buildBytes32FromUserNormalPlanetRecord(UserNormalPlanetRecord(0, 0, 0, 0, 0, 0, 0, 0, 0)),
      0x0000000000000000000000000000000000000000000000000000000000000000,
      "0"
    );

    Assert.equal(
      buildBytes32FromUserNormalPlanetRecord(UserNormalPlanetRecord(1, 2, 3, 4, 5, 6, 7, 8, 9)),
      0x0000000000000000090008000000070000000605040300020000000000000001,
      "1 to 9"
    );

    Assert.equal(
      buildBytes32FromUserNormalPlanetRecord(
        UserNormalPlanetRecord(0, 0, 1, 0, 0, 0, 0, -1, INT16_MIN)
      ),
      0x000000000000008000ffff000000000000000000000100000000000000000000,
      "minus"
    );
  }

  function _assertEqual(
    UserNormalPlanetRecord memory r1,
    UserNormalPlanetRecord memory r2,
    string memory message
  ) private {
    Assert.equal(
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
      ),
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

  function _expectRevert(bytes memory encoded, string memory message) private {
    (bool isSuccess, ) = address(this).call(encoded);
    Assert.isFalse(isSuccess, message);
  }

  function publishedUserNormalPlanetRecordOf(address account, uint16 userPlanetId) public view {
    userNormalPlanetRecordOf(account, userPlanetId);
  }
}
