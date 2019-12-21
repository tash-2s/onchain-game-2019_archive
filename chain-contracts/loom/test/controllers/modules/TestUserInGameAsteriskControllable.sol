pragma solidity 0.5.13;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/UserInGameAsteriskControllable.sol";

contract TestUserInGameAsteriskControllable is UserInGameAsteriskControllable {
  int16 constant INT16_MAX = int16(~(uint16(1) << 15));
  int16 constant INT16_MIN = int16(uint16(1) << 15);

  function beforeEach() public {
    userInGameAsteriskPermanence = new UserInGameAsteriskPermanence();
    userInGameAsteriskPermanence.addWhitelisted(address(this));
  }

  function testUserInGameAsteriskRecordsOf() public {
    address account = address(1);

    Assert.equal(userInGameAsteriskRecordsOf(account).length, 0, "empty");

    userInGameAsteriskPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000100010000000000000001
    );
    userInGameAsteriskPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000200020000000000000002
    );

    Assert.equal(userInGameAsteriskRecordsOf(account).length, 2, "added");
    Assert.equal(uint256(userInGameAsteriskRecordsOf(account)[0].kind), 1, "valid");
  }

  function testUserInGameAsteriskRecordsCountOf() public {
    address account = address(1);

    Assert.equal(userInGameAsteriskRecordsCountOf(account), 0, "0");

    userInGameAsteriskPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000100010000000000000001
    );
    userInGameAsteriskPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000200020000000000000002
    );

    Assert.equal(userInGameAsteriskRecordsCountOf(account), 2, "2");
  }

  function testUserInGameAsteriskRecordOf() public {
    address account = address(1);

    _expectRevert(
      abi.encodeWithSignature(
        "publishedUserInGameAsteriskRecordOf(address,uint16)",
        account,
        uint16(1)
      ),
      "(account, 1)"
    );

    userInGameAsteriskPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000100010000000000000001
    );
    userInGameAsteriskPermanence.createElement(
      account,
      0x0000000000000000000000000000000000000000000200020000000000000002
    );

    Assert.equal(uint256(userInGameAsteriskRecordOf(account, 2).id), uint256(2), "(account, 2)");

    _expectRevert(
      abi.encodeWithSignature(
        "publishedUserInGameAsteriskRecordOf(address,uint16)",
        account,
        uint16(3)
      ),
      "(account, 3)"
    );
  }

  function testSetInGameAsteriskToMap() public {
    address account = address(1);

    setInGameAsteriskToMap(account, 1, 1, 1, 1, 1, -1);
    setInGameAsteriskToMap(account, 2, 2, 2, 2, 100, 0);
    _assertEqual(
      userInGameAsteriskRecordOf(account, 1),
      UserInGameAsteriskRecord(1, 1, 1, 1, 1, Time.uint32now(), Time.uint32now(), 1, -1),
      "id: 1"
    );
    _assertEqual(
      userInGameAsteriskRecordOf(account, 2),
      UserInGameAsteriskRecord(2, 2, 2, 2, 1, Time.uint32now(), Time.uint32now(), 100, 0),
      "id: 2"
    );
  }

  function testRankupUserInGameAsterisk() public {
    address account = address(1);

    setInGameAsteriskToMap(account, 1, 1, 1, 1, 1, 1);
    UserInGameAsteriskRecord memory record = userInGameAsteriskRecordOf(account, 1);

    rankupUserInGameAsterisk(account, record, 0, 2);
    Assert.equal(uint256(userInGameAsteriskRecordOf(account, 1).rank), uint256(2), "2");

    rankupUserInGameAsterisk(account, record, 0, 30);
    Assert.equal(uint256(userInGameAsteriskRecordOf(account, 1).rank), uint256(30), "30");
  }

  function testBuildUserInGameAsteriskRecordFromBytes32() public {
    _assertEqual(
      buildUserInGameAsteriskRecordFromBytes32(
        0x0000000000000000000000000000000000000000000100010000000000000001
      ),
      UserInGameAsteriskRecord(1, 1, 1, 0, 0, 0, 0, 0, 0),
      "kind: 1"
    );

    _assertEqual(
      buildUserInGameAsteriskRecordFromBytes32(
        0x000000000000008000ffff000000000000000000000100000000000000000000
      ),
      UserInGameAsteriskRecord(0, 0, 1, 0, 0, 0, 0, -1, INT16_MIN),
      "minus coordinates"
    );
  }

  function testBuildBytes32FromUserInGameAsteriskRecord() public {
    Assert.equal(
      buildBytes32FromUserInGameAsteriskRecord(UserInGameAsteriskRecord(0, 0, 0, 0, 0, 0, 0, 0, 0)),
      0x0000000000000000000000000000000000000000000000000000000000000000,
      "0"
    );

    Assert.equal(
      buildBytes32FromUserInGameAsteriskRecord(UserInGameAsteriskRecord(1, 2, 3, 4, 5, 6, 7, 8, 9)),
      0x0000000000000000090008000000070000000605040300020000000000000001,
      "1 to 9"
    );

    Assert.equal(
      buildBytes32FromUserInGameAsteriskRecord(
        UserInGameAsteriskRecord(0, 0, 1, 0, 0, 0, 0, -1, INT16_MIN)
      ),
      0x000000000000008000ffff000000000000000000000100000000000000000000,
      "minus"
    );
  }

  function _assertEqual(
    UserInGameAsteriskRecord memory r1,
    UserInGameAsteriskRecord memory r2,
    string memory message
  ) private {
    Assert.equal(
      keccak256(
        abi.encodePacked(
          r1.id,
          r1.inGameAsteriskId,
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
          r2.inGameAsteriskId,
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

  function publishedUserInGameAsteriskRecordOf(address account, uint16 userAsteriskId) public view {
    userInGameAsteriskRecordOf(account, userAsteriskId);
  }
}
