pragma solidity 0.4.24;

import "truffle/Assert.sol";

import "../../../contracts/controllers/modules/UserSpecialPlanetControllable.sol";
import "../../../contracts/permanences/UserSpecialPlanetPermanence.sol";
import "../../../contracts/permanences/UserSpecialPlanetIdToOwnerPermanence.sol";

contract TestUserSpecialPlanetControllable is UserSpecialPlanetControllable {
  UserSpecialPlanetPermanence private _p = new UserSpecialPlanetPermanence();
  UserSpecialPlanetIdToOwnerPermanence private _idToOwnerP = new UserSpecialPlanetIdToOwnerPermanence(

  );

  function beforeAll() public {
    setUserSpecialPlanetPermanence(_p);
    setUserSpecialPlanetIdToOwnerPermanence(_idToOwnerP);
  }

  function testBuildUserSpecialPlanetRecordFromBytes32() public {
    _assertEqual(
      buildUserSpecialPlanetRecordFromBytes32(
        bytes32(0x0000000000000000000000000000000800070000000600000005040302000001)
      ),
      UserSpecialPlanetRecord(1, 2, 3, 4, 5, 6, 7, 8),
      "1 to 8"
    );
    _assertEqual(
      buildUserSpecialPlanetRecordFromBytes32(
        bytes32(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)
      ),
      UserSpecialPlanetRecord(16777215, 255, 255, 255, 4294967295, 4294967295, -1, -1),
      "all f"
    );
  }

  function testBuildBytes32FromUserSpecialPlanetRecord() public {
    Assert.equal(
      buildBytes32FromUserSpecialPlanetRecord(UserSpecialPlanetRecord(1, 2, 3, 4, 5, 6, 7, 8)),
      bytes32(0x0000000000000000000000000000000800070000000600000005040302000001),
      "1 to 8"
    );
    Assert.equal(
      buildBytes32FromUserSpecialPlanetRecord(
        UserSpecialPlanetRecord(16777215, 255, 255, 255, 4294967295, 4294967295, -1, -1)
      ),
      bytes32(0x0000000000000000000000000000ffffffffffffffffffffffffffffffffffff),
      "all f"
    );
  }

  function _assertEqual(UserSpecialPlanetRecord r1, UserSpecialPlanetRecord r2, string message)
    private
  {
    Assert.equal(
      keccak256(
        abi.encodePacked(
          r1.id,
          r1.kind,
          r1.originalParamCommonLogarithm,
          r1.rank,
          r1.rankupedAt,
          r1.createdAt,
          r1.axialCoordinateQ,
          r1.axialCoordinateR
        )
      ),
      keccak256(
        abi.encodePacked(
          r2.id,
          r2.kind,
          r2.originalParamCommonLogarithm,
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
}
