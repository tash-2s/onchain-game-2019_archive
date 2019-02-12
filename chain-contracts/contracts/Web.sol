pragma solidity 0.4.24;

//import "./UserNormalPlanet.sol";

contract Web {
  //UserNormalPlanet public userNormalPlanet;

  //constructor(
  //  address userNormalPlanetContractAddress
  //) public {
  //  userNormalPlanet = UserNormalPlanet(userNormalPlanetContractAddress);
  //}

  function getUser(address account)
    external
    view
    returns (
    uint256 confirmedGold,
    uint goldConfirmedAt,
    uint16[] unpIds, // [id, normalPlanetId, ...]
    uint8[] unpRanks,
    uint[] unpTimes, // [rankupedAt, createdAt, ...]
    uint[] unpAxialCorrdinates // [q, r, ...]
  )
  {
    confirmedGold = 0;
    goldConfirmedAt = 0;
    unpIds = new uint16[](2);
    unpIds[0] = 1;
    unpIds[1] = 1;
    unpRanks = new uint8[](1);
    unpRanks[0] = 1;
    unpTimes = new uint[](2);
    unpTimes[0] = 0;
    unpTimes[1] = 0;
    unpAxialCorrdinates = new uint[](2);
    unpAxialCorrdinates[0] = 0;
    unpAxialCorrdinates[1] = 0;
  }
}
