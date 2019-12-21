pragma solidity 0.5.13;

import "./modules/UserGoldControllable.sol";
import "./modules/UserInGameAsteriskControllable.sol";

import "../permanences/UserInGameAsteriskIdGeneratorPermanence.sol";

import "../libraries/TradableAsteriskTokenIdInterpreter.sol";

contract DebugController is UserGoldControllable, UserInGameAsteriskControllable {
  UserInGameAsteriskIdGeneratorPermanence public userInGameAsteriskIdGeneratorPermanence;

  constructor(
    address userGoldPermanenceAddress,
    address userInGameAsteriskPermanenceAddress,
    address userInGameAsteriskIdGeneratorPermanenceAddress
  ) public {
    userGoldPermanence = UserGoldPermanence(userGoldPermanenceAddress);
    userInGameAsteriskPermanence = UserInGameAsteriskPermanence(
      userInGameAsteriskPermanenceAddress
    );
    userInGameAsteriskIdGeneratorPermanence = UserInGameAsteriskIdGeneratorPermanence(
      userInGameAsteriskIdGeneratorPermanenceAddress
    );
  }

  function debugMintGold(address account, uint256 quantity) external {
    mintGold(account, quantity);
  }

  function debugMintMaxGold(address account) external {
    mintGold(account, ~uint256(0));
  }

  function debugMintUserInGameAsterisk(
    address account,
    uint16 inGameAsteriskId,
    uint8 kind,
    uint8 param,
    int16 coordinateQ,
    int16 coordinateR
  ) external {
    uint64[] memory ids = userInGameAsteriskIdGeneratorPermanence.generate(msg.sender, 1);
    setInGameAsteriskToMap(
      account,
      ids[0],
      inGameAsteriskId,
      kind,
      param,
      coordinateQ,
      coordinateR
    );
  }

  function debugMintMaxUserInGameAsterisks(address account) external {
    uint64 counter = uint64(userInGameAsteriskIdGeneratorPermanence.read(account));
    require(userInGameAsteriskRecordsCountOf(account) == 0, "you must not have asterisks");

    bytes32[] memory arr = new bytes32[](919);

    int256 q;
    int256 r;
    int256 start;
    int256 end;
    uint256 i = 0;
    uint16 inGameAsteriskId;
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
          inGameAsteriskId = 11;
          kind = 1;
          param = 10;
        } else if (i < 800) {
          inGameAsteriskId = 12;
          kind = 2;
          param = 11;
        } else {
          inGameAsteriskId = 15;
          kind = 3;
          param = 4;
        }

        arr[i++] = buildBytes32FromUserInGameAsteriskRecord(
          UserInGameAsteriskRecord(
            ++counter,
            inGameAsteriskId,
            kind,
            param,
            30,
            Time.uint32now(),
            Time.uint32now(),
            int16(q),
            int16(r)
          )
        );
      }
    }

    userInGameAsteriskPermanence.update(account, arr);
    userInGameAsteriskIdGeneratorPermanence.update(account, counter + 1);
  }

  function createTradableAsteriskTokenIds(uint256 count) external pure returns (uint256[] memory) {
    uint256[] memory ids = new uint256[](count);
    uint24 shortId = 1000; // to avoid collision
    for (uint256 i = 0; i < count; i++) {
      ids[i] = TradableAsteriskTokenIdInterpreter.fieldsToId(
        shortId,
        1,
        uint8((i % 2) + 1),
        1,
        shortId
      );
      shortId++;
    }
    return ids;
  }
}
