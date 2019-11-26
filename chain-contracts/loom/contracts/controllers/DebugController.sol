pragma solidity 0.5.11;

import "./modules/UserGoldControllable.sol";
import "./modules/UserNormalPlanetControllable.sol";

import "../permanences/UserNormalPlanetIdGeneratorPermanence.sol";

contract DebugController is UserGoldControllable, UserNormalPlanetControllable {
  UserNormalPlanetIdGeneratorPermanence public userNormalPlanetIdGeneratorPermanence;

  constructor(
    address userGoldPermanenceAddress,
    address userNormalPlanetPermanenceAddress,
    address userNormalPlanetIdGeneratorPermanenceAddress
  ) public {
    userGoldPermanence = UserGoldPermanence(userGoldPermanenceAddress);
    userNormalPlanetPermanence = UserNormalPlanetPermanence(userNormalPlanetPermanenceAddress);
    userNormalPlanetIdGeneratorPermanence = UserNormalPlanetIdGeneratorPermanence(
      userNormalPlanetIdGeneratorPermanenceAddress
    );
  }

  function debugMintGold(address account, uint256 quantity) external {
    mintGold(account, quantity);
  }

  function debugMintMaxGold(address account) external {
    mintGold(account, ~uint256(0));
  }

  function debugMintUserNormalPlanet(
    address account,
    uint16 normalPlanetId,
    uint8 kind,
    uint8 param,
    int16 coordinateQ,
    int16 coordinateR
  ) external {
    uint64[] memory ids = userNormalPlanetIdGeneratorPermanence.generate(msg.sender, 1);
    setNormalPlanetToMap(account, ids[0], normalPlanetId, kind, param, coordinateQ, coordinateR);
  }

  function debugMintMaxUserNormalPlanets(address account) external {
    uint64 counter = userNormalPlanetIdGeneratorPermanence.read(account);
    require(userNormalPlanetRecordsCountOf(account) == 0, "you must not have planets");

    bytes32[] memory arr = new bytes32[](919);

    int256 q;
    int256 r;
    int256 start;
    int256 end;
    uint256 i = 0;
    uint16 normalPlanetId;
    uint8 kind;
    uint8 param;

    for (q = -17; q <= 17; q++) {
      if (-17 < -q - 17) {
        start = -q - 17;
      } else {
        start = -17;
      }
      if (17 > -q + 17) {
        end = -q + 17;
      } else {
        end = 17;
      }

      for (r = start; r <= end; r++) {
        if (i < 400) {
          normalPlanetId = 11;
          kind = 1;
          param = 10;
        } else if (i < 800) {
          normalPlanetId = 12;
          kind = 2;
          param = 11;
        } else {
          normalPlanetId = 15;
          kind = 3;
          param = 4;
        }

        arr[i++] = buildBytes32FromUserNormalPlanetRecord(
          UserNormalPlanetRecord(
            ++counter,
            normalPlanetId,
            kind,
            param,
            30,
            uint32now(),
            uint32now(),
            int16(q),
            int16(r)
          )
        );
      }
    }

    userNormalPlanetPermanence.update(account, arr);
    userNormalPlanetIdGeneratorPermanence.update(account, counter + 1);
  }
}
