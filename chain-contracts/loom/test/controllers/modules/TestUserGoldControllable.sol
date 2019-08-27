pragma solidity 0.5.11;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/UserGoldControllable.sol";
import "../../../contracts/permanences/UserGoldPermanence.sol";

contract AssertionReporter {
  event TestEvent(bool indexed result, string message);

  function report(bool result, string memory message) public {
    if (result) emit TestEvent(true, "");
    else emit TestEvent(false, message);
  }
}

contract TestUserGoldControllable is UserGoldControllable {
  AssertionReporter private _reporter = new AssertionReporter();
  UserGoldPermanence private _permanence = new UserGoldPermanence();

  function beforeAll() public {
    setUserGoldPermanence(address(_permanence));
  }

  function testUserGoldPermanence() public {
    Assert.equal(
      address(_permanence),
      address(userGoldPermanence()),
      "#userGoldPermanence() should return the same address with the address set by #setUserGoldPermanence()"
    );
  }

  function testUserGoldRecordOf() public {
    address account = address(0x1111111111111111111111111111111111111111);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(0, 0),
      "#userGoldRecordOf() should return a empty record when the sender don't have data"
    );

    updateUserGoldRecord(account, UserGoldRecord(123456789, 1553948820));

    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(123456789, 1553948820),
      "#userGoldRecordOf() should return a correct record"
    );
  }

  function testMintGold() public {
    address account1 = address(0x2222222222222222222222222222222222222222);

    mintGold(account1, 0);
    _assertEqual(
      userGoldRecordOf(account1),
      UserGoldRecord(0, uint32now()),
      "#mintGold() should update confirmedAt only when the quantity of the arg is 0"
    );

    mintGold(account1, 1);
    _assertEqual(
      userGoldRecordOf(account1),
      UserGoldRecord(1, uint32now()),
      "#mintGold() should update balance (1)"
    );

    mintGold(account1, ~uint200(0) / 2);
    _assertEqual(
      userGoldRecordOf(account1),
      UserGoldRecord(1 + ~uint200(0) / 2, uint32now()),
      "#mintGold() should update balance (2)"
    );

    mintGold(account1, ~uint200(0) / 2 - 1);
    _assertEqual(
      userGoldRecordOf(account1),
      UserGoldRecord(~uint200(0) - 1, uint32now()),
      "#mintGold() should update balance (3)"
    );

    mintGold(account1, 1);
    _assertEqual(
      userGoldRecordOf(account1),
      UserGoldRecord(~uint200(0), uint32now()),
      "#mintGold() should update balance (4)"
    );

    mintGold(account1, 1);
    _assertEqual(
      userGoldRecordOf(account1),
      UserGoldRecord(~uint200(0), uint32now()),
      "#mintGold() should update balance (5)"
    );

    address account2 = address(0x3333333333333333333333333333333333333333);
    _assertEqual(userGoldRecordOf(account2), UserGoldRecord(0, 0), "");
    mintGold(account2, ~uint200(0) / 2);
    mintGold(account2, ~uint200(0) / 2 + 100);
    _assertEqual(
      userGoldRecordOf(account2),
      UserGoldRecord(~uint200(0), uint32now()),
      "#mintGold() should update balance (6)"
    );
  }

  function testUnmintGold1() public {
    address account = address(4);
    _assertEqual(userGoldRecordOf(account), UserGoldRecord(0, 0), "");

    unmintGold(account, 0);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(0, uint32now()),
      "#unmintGold() should decrease the balance (1)"
    );

    mintGold(account, 2);
    unmintGold(account, 1);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(1, uint32now()),
      "#unmintGold() should decrease the balance (2)"
    );

    unmintGold(account, 1);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(0, uint32now()),
      "#unmintGold() should decrease the balance (3)"
    );
  }

  function testUnmintGold2() public {
    address account = address(4);
    (bool isSuccessed, ) = address(this).call(
      abi.encodeWithSignature("wrappedUnmintGold(address,uint256)", account, 1)
    );
    Assert.isFalse(isSuccessed, "#unmintGold() should fail when the balance is not enough");

    mintGold(account, ~uint256(0));
    unmintGold(account, ~uint200(0) - 123);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(123, uint32now()),
      "#unmintGold() should decrease the balance (4)"
    );

    unmintGold(account, 123);
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(0, uint32now()),
      "#unmintGold() should decrease the balance (5)"
    );

    mintGold(account, ~uint256(0));
    unmintGold(account, ~uint200(0));
    _assertEqual(
      userGoldRecordOf(account),
      UserGoldRecord(0, uint32now()),
      "#unmintGold() should decrease the balance (6)"
    );
  }

  function testUpdateUserGoldRecord() public {
    address account = address(5);
    Assert.equal(_permanence.read(account), 0, "verify initialized");
    updateUserGoldRecord(account, UserGoldRecord(0, 0));
    Assert.equal(
      _permanence.read(account),
      USER_GOLD_PERMANENCE_PLACEHOLDER,
      "#updateUserGoldRecord() should update permanence data"
    );
  }

  function testBuildUint256FromUserGoldRecord() public {
    Assert.equal(
      buildUint256FromUserGoldRecord(UserGoldRecord(0, 0)),
      10000000000000000000000000000000000000000000000000000000000000000000000000000,
      "#buildUint256FromUserGoldRecord 0, 0"
    );
    Assert.equal(
      buildUint256FromUserGoldRecord(UserGoldRecord(1234, 5678)),
      10000000000056780000000000000000000000000000000000000000000000000000000001234,
      "#buildUint256FromUserGoldRecord 1234, 5678"
    );
    Assert.equal(
      buildUint256FromUserGoldRecord(UserGoldRecord(~uint200(0), ~uint32(0))),
      10000042949672951606938044258990275541962092341162602522202993782792835301375,
      "#buildUint256FromUserGoldRecord max, max"
    );
  }

  function testBuildUserGoldRecordFromUint256() public {
    _assertEqual(
      buildUserGoldRecordFromUint256(0),
      UserGoldRecord(0, 0),
      "#buildUserGoldRecordFromUint256(0)"
    );
    _assertEqual(
      buildUserGoldRecordFromUint256(
        10000000000000000000000000000000000000000000000000000000000000000000000000000
      ),
      UserGoldRecord(0, 0),
      "#buildUserGoldRecordFromUint256(10000000000000000000000000000000000000000000000000000000000000000000000000000)"
    );
    _assertEqual(
      buildUserGoldRecordFromUint256(
        10000000000056780000000000000000000000000000000000000000000000000000000001234
      ),
      UserGoldRecord(1234, 5678),
      "#buildUserGoldRecordFromUint256(10000000000056780000000000000000000000000000000000000000000000000000000001234)"
    );
    _assertEqual(
      buildUserGoldRecordFromUint256(
        10000042949672951606938044258990275541962092341162602522202993782792835301375
      ),
      UserGoldRecord(~uint200(0), ~uint32(0)),
      "#buildUserGoldRecordFromUint256(10000042949672951606938044258990275541962092341162602522202993782792835301375)"
    );
  }

  function _assertEqual(UserGoldRecord memory r1, UserGoldRecord memory r2, string memory message)
    private
  {
    _reporter.report(r1.balance == r2.balance && r1.confirmedAt == r2.confirmedAt, message);
  }

  // make #unmintGold() public
  function wrappedUnmintGold(address account, uint256 quantity) public {
    unmintGold(account, quantity);
  }
}
