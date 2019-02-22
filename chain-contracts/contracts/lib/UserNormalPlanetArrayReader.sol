pragma solidity 0.4.24;

// This is for the return value of UserNormalPlanet#userPlanets
library UserNormalPlanetArrayReader {
  uint8 constant USER_PLANET_FIELD_COUNT = 9;

  uint8 constant USER_PLANET_ID_INDEX = 0;
  uint8 constant USER_PLANET_NORMAL_PLANET_ID_INDEX = 1;
  uint8 constant USER_PLANET_KIND_INDEX = 2;
  uint8 constant USER_PLANET_ORIGINAL_PARAM_INDEX = 3;
  uint8 constant USER_PLANET_RANK_INDEX = 4;
  uint8 constant USER_PLANET_RANKUPED_AT_INDEX = 5;
  uint8 constant USER_PLANET_CREATED_AT_INDEX = 6;
  uint8 constant USER_PLANET_AXIAL_COORDINATE_Q_INDEX = 7;
  uint8 constant USER_PLANET_AXIAL_COORDINATE_R_INDEX = 8;

  function userPlanetFieldCount() public pure returns (uint8) {
    return USER_PLANET_FIELD_COUNT;
  }

  function userPlanetIdIndex() public pure returns (uint8) {
    return USER_PLANET_ID_INDEX;
  }
  function userPlanetNormalIdIndex() public pure returns (uint8) {
    return USER_PLANET_NORMAL_PLANET_ID_INDEX;
  }
  function userPlanetKindIndex() public pure returns (uint8) {
    return USER_PLANET_KIND_INDEX;
  }
  function userPlanetOriginalParamIndex() public pure returns (uint8) {
    return USER_PLANET_ORIGINAL_PARAM_INDEX;
  }
  function userPlanetRankIndex() public pure returns (uint8) {
    return USER_PLANET_RANK_INDEX;
  }
  function userPlanetRankupedAtIndex() public pure returns (uint8) {
    return USER_PLANET_RANKUPED_AT_INDEX;
  }
  function userPlanetCreatedAtIndex() public pure returns (uint8) {
    return USER_PLANET_CREATED_AT_INDEX;
  }
  function userPlanetAxialCoordinateQIndex() public pure returns (uint8) {
    return USER_PLANET_AXIAL_COORDINATE_Q_INDEX;
  }
  function userPlanetAxialCoordinateRIndex() public pure returns (uint8) {
    return USER_PLANET_AXIAL_COORDINATE_R_INDEX;
  }

  function id(int48[] userPlanets, uint256 userPlanetIndex) public pure returns (uint16) {
    return uint16(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + USER_PLANET_ID_INDEX]);
  }

  function normalPlanetId(int48[] userPlanets, uint256 userPlanetIndex) public pure returns (uint16) {
    return uint16(
      userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + USER_PLANET_NORMAL_PLANET_ID_INDEX]
    );
  }

  function originalParam(int48[] userPlanets, uint256 userPlanetIndex) public pure returns (uint16) {
    return uint16(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + USER_PLANET_ORIGINAL_PARAM_INDEX]);
  }

  function kind(int48[] userPlanets, uint256 userPlanetIndex) public pure returns (uint8) {
    return uint8(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + USER_PLANET_KIND_INDEX]);
  }

  function rank(int48[] userPlanets, uint256 userPlanetIndex) public pure returns (uint8) {
    return uint8(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + USER_PLANET_RANK_INDEX]);
  }

  function rankupedAt(int48[] userPlanets, uint256 userPlanetIndex) public pure returns (uint40) {
    return uint40(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + USER_PLANET_RANKUPED_AT_INDEX]);
  }

  function createdAt(int48[] userPlanets, uint256 userPlanetIndex) public pure returns (uint40) {
    return uint40(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + USER_PLANET_CREATED_AT_INDEX]);
  }

  function axialCoordinateQ(int48[] userPlanets, uint256 userPlanetIndex) public pure returns (int16) {
    return int16(
      userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + USER_PLANET_AXIAL_COORDINATE_Q_INDEX]
    );
  }

  function axialCoordinateR(int48[] userPlanets, uint256 userPlanetIndex) public pure returns (int16) {
    return int16(
      userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + USER_PLANET_AXIAL_COORDINATE_R_INDEX]
    );
  }

  function ratedParam(int48[] userPlanets, uint256 userPlanetIndex) public pure returns (uint) {
    return originalParam(userPlanets, userPlanetIndex) * (2 ** (uint256(
      rank(userPlanets, userPlanetIndex)
    ) - 1));
  }

  function userPlanetsCount(int48[] userPlanets) public pure returns (uint) {
    // here?
    require(userPlanets.length % USER_PLANET_FIELD_COUNT == 0, "broken userPlanets");
    return userPlanets.length / USER_PLANET_FIELD_COUNT;
  }
}
