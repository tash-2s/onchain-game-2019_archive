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
    // createdAt,rankupedAt,coordinates
  }

  function balanceOf(address account) public view returns (uint256) {
    return (_userPlanets[account].length);
  }

  function userPlanets(address account) public view returns (uint16[]) {
    UserPlanet[] memory ups = _userPlanets[account];
    uint16[] memory arrayedUserPlanets = new uint16[](ups.length * 3);
    uint counter = 0;

    for (uint16 i = 0; i < ups.length; i++) {
      arrayedUserPlanets[counter + 0] = ups[i].id;
      arrayedUserPlanets[counter + 1] = ups[i].normalPlanetId;
      arrayedUserPlanets[counter + 2] = ups[i].rank;
      counter += 3;
    }

    return (arrayedUserPlanets);
  }

  function mint(address account, uint16 normalPlanetId) public onlyMinter {
    require(normalPlanet.isPlanet(normalPlanetId), "planet is not found");
    _userPlanets[account].push(
      UserPlanet(_idGenerator[account]++, normalPlanetId, 1)
    );
  }

  function remove(address account, uint16 id) public onlyMinter {
    require(id < _idGenerator[account], "id is not valid");

    UserPlanet[] memory oldUserPlanets = _userPlanets[account];
    uint counter = 0;

    _userPlanets[account].length--;
    for (uint16 i = 0; i < oldUserPlanets.length; i++) {
      if (oldUserPlanets[i].id != id) {
        _userPlanets[account][counter] = oldUserPlanets[i];
        counter++;
      }
    }
  }
}
