pragma solidity 0.4.24;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/UserGoldControllable.sol";
import "../../../contracts/permanences/UserGoldPermanence.sol";

contract UserGoldPermanenceForTest is UserGoldPermanence {
  // function addMinterForTest(address account) public {
  //   _addMinter(account); // I cannot understand why this method throws an error...
  // }

  // Skip minter-check because of the above reason.
  // I wanted to add the test contract to minters.
  modifier onlyMinter() {
    _;
  }
}

contract MyAssert {
  event TestEvent(bool indexed result, string message);

  function report(bool result, string memory message) public {
    if (result) emit TestEvent(true, "");
    else emit TestEvent(false, message);
  }
}

contract TestUserGoldControllable is UserGoldControllable {
  MyAssert private myAssert = new MyAssert();
  UserGoldPermanenceForTest private permanence = new UserGoldPermanenceForTest();

  function beforeAll() public {
    // p.addMinterForTest(address(this));
    setUserGoldPermanence(permanence);
  }

  function testUserGoldPermanence() public {
    Assert.equal(
      permanence,
      userGoldPermanence(),
      "#userGoldPermanence() should return the same address with the address set by #setUserGoldPermanence()"
    );
  }

  function testBuildUserGoldRecord() public {
    assertEqual(
      buildUserGoldRecord(0),
      UserGoldRecord(0, 0),
      "#buildUserGoldRecord() should return a correct record"
    );
  }

  function assertEqual(UserGoldRecord r1, UserGoldRecord r2, string memory message) private {
    myAssert.report(r1.balance == r2.balance && r1.confirmedAt == r2.confirmedAt, message);
  }
}
