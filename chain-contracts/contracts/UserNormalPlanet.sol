pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";

import "./NormalPlanet.sol";
import "./lib/Util.sol";
import "./lib/UserNormalPlanetArrayReader.sol";

contract UserNormalPlanet is MinterRole {
  NormalPlanet public normalPlanet;

  mapping(address => uint16) private _idGenerator;
  mapping(address => UserPlanet[]) private _userPlanets;

  constructor(address normalPlanetContractAddress) public {
    normalPlanet = NormalPlanet(normalPlanetContractAddress);
  }

  struct UserPlanet {
    uint16 id;
    uint16 normalPlanetId;
    uint8 kind;
    uint16 originalParam;
    uint8 rank;
    uint40 rankupedAt;
    uint40 createdAt;
    uint16 axialCoordinateQ;
    uint16 axialCoordinateR;
  }

  function balanceOf(address account) public view returns (uint256) {
    return (_userPlanets[account].length);
  }

  function userPlanets(address account) public view returns (uint40[]) {
    UserPlanet[] storage ups = _userPlanets[account];
    uint40[] memory arrUps = new uint40[](ups.length * UserNormalPlanetArrayReader.userPlanetFieldCount());
    uint c = 0;

    for (uint16 i = 0; i < ups.length; i++) {
      arrUps[c + UserNormalPlanetArrayReader.userPlanetIdIndex()] = ups[i].id;
      arrUps[c + UserNormalPlanetArrayReader.userPlanetNormalIdIndex()] = ups[i].normalPlanetId;
      arrUps[c + UserNormalPlanetArrayReader.userPlanetKindIndex()] = ups[i].kind;
      arrUps[c + UserNormalPlanetArrayReader.userPlanetOriginalParamIndex()] = ups[i].originalParam;
      arrUps[c + UserNormalPlanetArrayReader.userPlanetRankIndex()] = ups[i].rank;
      arrUps[c + UserNormalPlanetArrayReader.userPlanetRankupedAtIndex()] = ups[i].rankupedAt;
      arrUps[c + UserNormalPlanetArrayReader.userPlanetCreatedAtIndex()] = ups[i].createdAt;
      arrUps[c + UserNormalPlanetArrayReader.userPlanetAxialCoordinateQIndex()] = ups[i].axialCoordinateQ;
      arrUps[c + UserNormalPlanetArrayReader.userPlanetAxialCoordinateRIndex()] = ups[i].axialCoordinateR;

      c += UserNormalPlanetArrayReader.userPlanetFieldCount();
    }

    return (arrUps);
  }

  function mint(address account, uint16 normalPlanetId, uint16 axialCoordinateQ, uint16 axialCoordinateR)
    public
    onlyMinter
  {
    (uint8 kind, uint16 param, ) = normalPlanet.planet(normalPlanetId);

    UserPlanet[] storage ups = _userPlanets[account];
    for (uint16 i = 0; i < ups.length; i++) {
      // TODO: for big planets
      if ((ups[i].axialCoordinateQ == axialCoordinateQ) && (ups[i].axialCoordinateR == axialCoordinateR)) {
        revert("the coordinates are already used");
      }
    }

    _userPlanets[account].push(
      UserPlanet(
        _idGenerator[account]++,
        normalPlanetId,
        kind,
        param,
        1,
        Util.uint40now(),
        Util.uint40now(),
        axialCoordinateQ,
        axialCoordinateR
      )
    );
  }

  function unmint(address account, uint16 id) public onlyMinter {
    require(id < _idGenerator[account], "id is not valid");

    UserPlanet[] storage ups = _userPlanets[account];
    UserPlanet[] memory oldUserPlanets = ups;
    uint counter = 0;

    ups.length--;
    for (uint16 i = 0; i < oldUserPlanets.length; i++) {
      if (oldUserPlanets[i].id != id) {
        ups[counter] = oldUserPlanets[i];
        counter++;
      }
    }
  }
}
