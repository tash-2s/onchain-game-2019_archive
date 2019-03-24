pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./controllers/UserGoldControllable.sol";
import "./controllers/NormalPlanetControllable.sol";
import "./controllers/UserNormalPlanetControllable.sol";
import "./RemarkableUsers.sol";

contract Logic is UserGoldControllable, NormalPlanetControllable, UserNormalPlanetControllable {
  RemarkableUsers public remarkableUsers;

  constructor(
    address userGoldPermanenceAddress,
    address normalPlanetPermanenceAddress,
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdCounterPermanenceAddress,
    address remarkableUsersContractAddress
  ) public {
    setUserGoldPermanence(userGoldPermanenceAddress);
    setNormalPlanetPermanence(normalPlanetPermanenceAddress);
    setUserNormalPlanetPermanence(userNormalPlanetPermanenceAddress);
    setUserNormalPlanetIdCounterPermanence(userNormalPlanetIdCounterPermanenceAddress);
    remarkableUsers = RemarkableUsers(remarkableUsersContractAddress);
  }

  function setPlanet(uint16 planetId, int16 axialCoordinateQ, int16 axialCoordinateR) public {
    NormalPlanetRecord memory planetRecord = normalPlanetRecordOf(planetId);
    UserGoldRecord memory goldRecord = userGoldRecordOf(msg.sender);

    // this is not precise
    if (userNormalPlanetRecordsCountOf(msg.sender) == 0 && goldRecord.balance == 0) {
      mintGold(msg.sender, uint200(SafeMath.sub(10, planetRecord.priceGold)));
    } else {
      confirm(msg.sender);
      unmintGold(msg.sender, planetRecord.priceGold);
    }

    mintUserNormalPlanet(
      msg.sender,
      planetId,
      planetRecord.kind,
      planetRecord.param,
      axialCoordinateQ,
      axialCoordinateR
    );
  }

  function confirm(address account) private returns (uint) {
    uint population = 0;
    uint goldPower = 0;
    uint techPower = 0;

    UserNormalPlanetRecord[] memory userPlanets = userNormalPlanetRecordsOf(account);
    UserNormalPlanetRecord memory userPlanet;
    uint rated;

    for (uint i = 0; i < userPlanets.length; i++) {
      userPlanet = userPlanets[i];

      rated = userPlanet.originalParam * (2 ** (uint256(userPlanet.rank) - 1));
      if (userPlanet.kind == 1) {
        population += rated;
      } else if (userPlanet.kind == 2) {
        goldPower += rated;
      } else if (userPlanet.kind == 3) {
        techPower += rated;
      } else {
        revert("undefined kind");
      }
    }

    // TODO: type
    uint goldPerSec = population * goldPower;
    uint32 diffSec = uint32now() - userGoldRecordOf(account).confirmedAt;
    uint diffGold = goldPerSec * diffSec;

    if (diffGold > 0) {
      mintGold(account, uint200(diffGold));
      remarkableUsers.tackle(account);
    }

    return techPower;
  }

  function rankupUserNormalPlanet(uint16 userNormalPlanetId) public {
    uint techPower = confirm(msg.sender);
    UserNormalPlanetRecord memory userPlanet = userNormalPlanetRecordOf(
      msg.sender,
      userNormalPlanetId
    );

    // ckeck time
    uint diffSec = uint32now() - userPlanet.rankupedAt;
    int remainingSec = int(10 * 60 * (2 ** (uint256(userPlanet.rank) - 1))) - int(diffSec) - int(
      techPower
    ); // TODO: type
    require(remainingSec <= 0, "need more time to rankup");

    // decrease required gold
    NormalPlanetRecord memory planetRecord = normalPlanetRecordOf(userPlanet.normalPlanetId);
    uint200 rankupGold = uint200(
      (planetRecord.priceGold / 5) * (2 ** (uint256(userPlanet.rank) - 1))
    );
    unmintGold(msg.sender, rankupGold);

    _rankupUserNormalPlanet(msg.sender, userNormalPlanetId);
  }
}
