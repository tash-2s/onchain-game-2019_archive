pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/access/roles/MinterRole.sol";
import "./NormalPlanet.sol";

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
    uint8 rank;
    uint256 rankupedAt;
    uint256 createdAt;
    uint16 axialCoordinateQ;
    uint16 axialCoordinateR;
  }

  function balanceOf(address account) public view returns (uint256) {
    return (_userPlanets[account].length);
  }

  function userPlanets(address account) public view returns (uint256[]) {
    UserPlanet[] storage ups = _userPlanets[account];
    uint256[] memory arrayedUserPlanets = new uint256[](ups.length * 7);
    uint counter = 0;

    for (uint16 i = 0; i < ups.length; i++) {
      arrayedUserPlanets[counter + 0] = ups[i].id;
      arrayedUserPlanets[counter + 1] = ups[i].normalPlanetId;
      arrayedUserPlanets[counter + 2] = ups[i].rank;
      arrayedUserPlanets[counter + 3] = ups[i].rankupedAt;
      arrayedUserPlanets[counter + 4] = ups[i].createdAt;
      arrayedUserPlanets[counter + 5] = ups[i].axialCoordinateQ;
      arrayedUserPlanets[counter + 6] = ups[i].axialCoordinateR;
      counter += 7;
    }

    return (arrayedUserPlanets);
  }

  function userPlanetsExternal(address account)
    external
    view
    returns (
    uint16[] ids,
    uint16[] normalPlanetIds,
    uint8[] ranks,
    uint256[] rankupedAts,
    uint256[] createdAts,
    uint16[] axialCoordinateQs,
    uint16[] axialCoordinateRs
  )
  {
    UserPlanet[] storage ups = _userPlanets[account];

    ids = new uint16[](ups.length);
    normalPlanetIds = new uint16[](ups.length);
    ranks = new uint8[](ups.length);
    rankupedAts = new uint256[](ups.length);
    createdAts = new uint256[](ups.length);
    axialCoordinateQs = new uint16[](ups.length);
    axialCoordinateRs = new uint16[](ups.length);

    for (uint16 i = 0; i < ups.length; i++) {
      ids[i] = ups[i].id;
      normalPlanetIds[i] = ups[i].normalPlanetId;
      ranks[i] = ups[i].rank;
      rankupedAts[i] = ups[i].rankupedAt;
      createdAts[i] = ups[i].createdAt;
      axialCoordinateQs[i] = ups[i].axialCoordinateQ;
      axialCoordinateRs[i] = ups[i].axialCoordinateR;
    }
  }

  // TODO: coordinates
  function mint(address account, uint16 normalPlanetId) public onlyMinter {
    require(normalPlanet.isPlanet(normalPlanetId), "planet is not found");
    _userPlanets[account].push(
      UserPlanet(
        _idGenerator[account]++,
        normalPlanetId,
        1,
        block.timestamp,
        block.timestamp,
        0,
        0
      )
    );
  }

  function remove(address account, uint16 id) public onlyMinter {
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
