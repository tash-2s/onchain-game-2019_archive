pragma solidity 0.5.13;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/UserGoldControllable.sol";

contract TestUserGoldControllable is UserGoldControllable {
  function beforeEach() public {
    userGoldPermanence = new UserGoldPermanence();
    userGoldPermanence.addWhitelisted(address(this));
  }

  function testUserGoldRecordOf() public {
    address account = address(1);
    _assertEqual(userGoldRecordOf(account), UserGoldRecord(0, 0), "(0 ,0)");

    updateUserGoldRecord(account, UserGoldRecord(123456789, 1553948820));

    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(123456789, 1553948820),
      "(123456789, 1553948820)"
    );
  }

  function testMintGold() public {
    address account = address(1);

    mintGold(account, 0);
    _assertEqual(userGoldRecordOf(account), UserGoldRecord(0, Time.uint32now()), "(account, 0)");

    mintGold(account, 1);
    _assertEqual(userGoldRecordOf(account), UserGoldRecord(1, Time.uint32now()), "(account, 1) 1");

    mintGold(account, ~uint200(0) / 2);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(1 + ~uint200(0) / 2, Time.uint32now()),
      "(account, ~uint200(0) / 2)"
    );

    mintGold(account, ~uint200(0) / 2 - 1);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(~uint200(0) - 1, Time.uint32now()),
      "(account, ~uint200(0) / 2 - 1)"
    );

    mintGold(account, 1);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(~uint200(0), Time.uint32now()),
      "(account, 1) 2"
    );

    mintGold(account, 1);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(~uint200(0), Time.uint32now()),
      "(account, 1) 3"
    );

    address account2 = address(2);
    mintGold(account2, ~uint256(0));
    _assertEqual(
      userGoldRecordOf(account2),
      UserGoldRecord(~uint200(0), Time.uint32now()),
      "(account2, ~uint256(0))"
    );
  }

  function testUnmintGold1() public {
    address account = address(1);
    _assertEqual(userGoldRecordOf(account), UserGoldRecord(0, 0), "");

    unmintGold(account, 0);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(0, Time.uint32now()),
      "#unmintGold() should decrease the balance (1)"
    );

    mintGold(account, 2);
    unmintGold(account, 1);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(1, Time.uint32now()),
      "#unmintGold() should decrease the balance (2)"
    );

    unmintGold(account, 1);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(0, Time.uint32now()),
      "#unmintGold() should decrease the balance (3)"
    );
  }

  function testUnmintGold2() public {
    address account = address(1);
    _expectRevert(
      abi.encodeWithSignature("publishedUnmintGold(address,uint256)", account, 1),
      "#unmintGold() should fail when the balance is not enough"
    );

    mintGold(account, ~uint256(0));
    unmintGold(account, ~uint200(0) - 123);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(123, Time.uint32now()),
      "#unmintGold() should decrease the balance (4)"
    );

    unmintGold(account, 123);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(0, Time.uint32now()),
      "#unmintGold() should decrease the balance (5)"
    );

    mintGold(account, ~uint256(0));
    unmintGold(account, ~uint200(0));
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(0, Time.uint32now()),
      "#unmintGold() should decrease the balance (6)"
    );
  }

  function testBuildBytes32FromUserGoldRecord() public {
    Assert.equal(buildBytes32FromUserGoldRecord(UserGoldRecord(0, 0)), 0x0, "(0, 0)");
    Assert.equal(
      buildBytes32FromUserGoldRecord(UserGoldRecord(~uint200(0), ~uint32(0))),
      0x000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff,
      "(~uint200(0), ~uint32(0))"
    );
  }

  function testBuildUserGoldRecordFromBytes32() public {
    _assertEqual(buildUserGoldRecordFromBytes32(0x0), UserGoldRecord(0, 0), "(0 ,0)");
    _assertEqual(
      buildUserGoldRecordFromBytes32(
        0x0000000000162e000000000000000000000000000000000000000000000004d2
      ),
      UserGoldRecord(1234, 5678),
      "(1234, 5678)"
    );
  }

  function _assertEqual(UserGoldRecord memory r1, UserGoldRecord memory r2, string memory message)
    private
  {
    Assert.equal(
      keccak256(abi.encodePacked(r1.balance, r1.confirmedAt)),
      keccak256(abi.encodePacked(r2.balance, r2.confirmedAt)),
      message
    );
  }

  function _expectRevert(bytes memory encoded, string memory message) private {
    (bool isSuccess, ) = address(this).call(encoded);
    Assert.isFalse(isSuccess, message);
  }

  function publishedUnmintGold(address account, uint256 quantity) public {
    unmintGold(account, quantity);
  }
}
