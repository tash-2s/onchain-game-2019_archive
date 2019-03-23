pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./controllers/UserGoldControllable.sol";
import "./NormalPlanet.sol";
import "./UserNormalPlanet.sol";
import "./RemarkableUsers.sol";
import "./lib/Util.sol";
import "./lib/UserNormalPlanetArrayReader.sol";

contract Logic is UserGoldControllable {
  NormalPlanet public normalPlanet;
  UserNormalPlanet public userNormalPlanet;
  RemarkableUsers public remarkableUsers;

  constructor(
    address userGoldPermanenceAddress,
    address normalPlanetContractAddress,
    address userNormalPlanetContractAddress,
    address remarkableUsersContractAddress
  ) public {
    setUserGoldPermanence(userGoldPermanenceAddress);
    normalPlanet = NormalPlanet(normalPlanetContractAddress);
    userNormalPlanet = UserNormalPlanet(userNormalPlanetContractAddress);
    remarkableUsers = RemarkableUsers(remarkableUsersContractAddress);
  }

  function setPlanet(uint16 planetId, int16 axialCoordinateQ, int16 axialCoordinateR) public {
    (, , uint200 planetPrice) = normalPlanet.planet(planetId);
    UserGoldRecord memory goldRecord = userGoldRecordOf(msg.sender);

    // this is not precise
    if (userNormalPlanet.balanceOf(msg.sender) == 0 && goldRecord.balance == 0) {
      mintGold(msg.sender, uint200(SafeMath.sub(10, planetPrice)));
    } else {
      confirm(msg.sender);
      unmintGold(msg.sender, planetPrice);
    }

    userNormalPlanet.mint(msg.sender, planetId, axialCoordinateQ, axialCoordinateR);
  }

  function confirm(address account) private returns (uint) {
    uint population = 0;
    uint goldPower = 0;
    uint techPower = 0;

    int48[] memory userPlanets = userNormalPlanet.userPlanets(account);

    for (uint i = 0; i < UserNormalPlanetArrayReader.userPlanetsCount(userPlanets); i++) {
      if (UserNormalPlanetArrayReader.kind(userPlanets, i) == 1) {
        population += UserNormalPlanetArrayReader.ratedParam(userPlanets, i);
      } else if (UserNormalPlanetArrayReader.kind(userPlanets, i) == 2) {
        goldPower += UserNormalPlanetArrayReader.ratedParam(userPlanets, i);
      } else if (UserNormalPlanetArrayReader.kind(userPlanets, i) == 3) {
        techPower += UserNormalPlanetArrayReader.ratedParam(userPlanets, i);
      } else {
        revert("undefined kind");
      }
    }

    // TODO: type
    uint goldPerSec = population * goldPower;
    uint40 diffSec = Util.uint40now() - userGoldRecordOf(account).confirmedAt;
    uint diffGold = goldPerSec * diffSec;

    if (diffGold > 0) {
      mintGold(account, uint200(diffGold));
      remarkableUsers.tackle(account);
    }

    return techPower;
  }

  function rankupUserNormalPlanet(uint16 userNormalPlanetId) public {
    uint techPower = confirm(msg.sender);
    int48[] memory userPlanet = userNormalPlanet.userPlanet(msg.sender, userNormalPlanetId);

    // ckeck time
    uint diffSec = Util.uint40now() - UserNormalPlanetArrayReader.rankupedAt(userPlanet, 0);
    int remainingSec = int(UserNormalPlanetArrayReader.requiredSecForRankup(userPlanet, 0)) - int(
      diffSec
    ) - int(techPower);
    require(remainingSec <= 0, "need more time to rankup");

    // decrease required gold
    (, , uint200 planetPrice) = normalPlanet.planet(
      UserNormalPlanetArrayReader.normalPlanetId(userPlanet, 0)
    );
    uint200 rankupGold = uint200((planetPrice / 5) * UserNormalPlanetArrayReader.rate(userPlanet, 0)); // TODO: type?
    unmintGold(msg.sender, rankupGold);

    userNormalPlanet.rankup(msg.sender, userNormalPlanetId);
  }
}
