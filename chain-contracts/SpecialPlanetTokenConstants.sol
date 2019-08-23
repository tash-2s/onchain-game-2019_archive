pragma solidity 0.5.11;

contract SpecialPlanetTokenConstants {
  uint8 constant TOKEN_ID_SHORT_ID_START_BIT = 0;
  uint8 constant TOKEN_ID_VERSION_START_BIT = 24;
  uint8 constant TOKEN_ID_KIND_START_BIT = 24 + 8;
  uint8 constant TOKEN_ID_OPCL_START_BIT = 24 + 8 + 8;
  uint8 constant TOKEN_ID_ART_SEED_START_BIT = 24 + 8 + 8 + 8;
}
