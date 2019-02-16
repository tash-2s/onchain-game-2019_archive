pragma solidity 0.4.24;

// This is for the return value of UserNormalPlanet#userPlanets
library UserNormalPlanetArrayReader {
  uint256 constant USER_PLANET_FIELD_COUNT = 7;

  function id(uint40[] userPlanets, uint256 userPlanetIndex)
    public
    pure
    returns (uint16)
  {
    return uint16(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + 0]);
  }

  function planetId(uint40[] userPlanets, uint256 userPlanetIndex)
    public
    pure
    returns (uint16)
  {
    return uint16(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + 1]);
  }

  function rank(uint40[] userPlanets, uint256 userPlanetIndex)
    public
    pure
    returns (uint8)
  {
    return uint8(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + 2]);
  }

  function rankupedAt(uint40[] userPlanets, uint256 userPlanetIndex)
    public
    pure
    returns (uint40)
  {
    return uint40(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + 3]);
  }

  function createdAt(uint40[] userPlanets, uint256 userPlanetIndex)
    public
    pure
    returns (uint40)
  {
    return uint40(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + 4]);
  }

  function axialCoordinateQ(uint40[] userPlanets, uint256 userPlanetIndex)
    public
    pure
    returns (uint16)
  {
    return uint16(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + 5]);
  }

  function axialCoordinateR(uint40[] userPlanets, uint256 userPlanetIndex)
    public
    pure
    returns (uint16)
  {
    return uint16(userPlanets[userPlanetIndex * USER_PLANET_FIELD_COUNT + 6]);
  }
}
