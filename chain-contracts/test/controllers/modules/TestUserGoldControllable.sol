pragma solidity 0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

import "../../../contracts/controllers/modules/UserGoldControllable.sol";

contract MyAssert {
  event TestEvent(bool indexed result, string message);

  function report(bool result, string memory message) public {
    if (result) emit TestEvent(true, "");
    else emit TestEvent(false, message);
  }
}

contract TestUserGoldControllable is UserGoldControllable {
  MyAssert myAssert;

  function beforeAll() public {
    myAssert = new MyAssert();
    setUserGoldPermanence(DeployedAddresses.UserGoldPermanence());
  }

  function testUserGoldPermanenceAddress() public {
    Assert.equal(
      DeployedAddresses.UserGoldPermanence(),
      userGoldPermanence(),
      "#userGoldPermanence() should return the same address with the address provided via the constructor arg"
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
