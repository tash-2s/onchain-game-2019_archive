import { AbstractActions } from "./AbstractActions"

import { chains } from "../misc/chains"

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<{
    address: string
    user: UserResponse
    userNormalPlanets: UserNormalPlanetsResponse
    userSpecialPlanets: UserSpecialPlanetsResponse
  }>("setTargetUser")
  setTargetUser = async (address: string) => {
    const [userNormalPlanetsResponse, userSpecialPlanetsResponse] = await Promise.all([
      getUserAndUserNormalPlanets(address),
      getUserAndUserSpecialPlanets(address)
    ])

    this.dispatch(
      UserActions.setTargetUser({
        address,
        user: userNormalPlanetsResponse.user,
        userNormalPlanets: userNormalPlanetsResponse.userNormalPlanets,
        userSpecialPlanets: userSpecialPlanetsResponse.userSpecialPlanets
      })
    )
  }

  static clearTargetUser = UserActions.creator("clearTargetUser")
  clearTargetUser = () => {
    this.dispatch(UserActions.clearTargetUser())
  }
}

export type UserResponse = [string, string]

export type UserNormalPlanetsResponse = [Array<string>, Array<string>, Array<string>, Array<string>]
export interface UserAndUserNormalPlanetsResponse {
  user: UserResponse
  userNormalPlanets: UserNormalPlanetsResponse
}
export const getUserAndUserNormalPlanets = async (
  address: string
): Promise<UserAndUserNormalPlanetsResponse> => {
  const response = await chains.loom
    .userController()
    .methods.getUser(address)
    .call()

  return {
    user: [response.confirmedGold, response.goldConfirmedAt],
    userNormalPlanets: [
      response.unpIds,
      response.unpRanks,
      response.unpTimes,
      response.unpAxialCoordinates
    ]
  }
}

export type UserSpecialPlanetsResponse = [
  Array<string>,
  Array<string>,
  Array<string>,
  Array<string>,
  Array<string>,
  Array<string>
]
export interface UserAndUserSpecialPlanetsResponse {
  user: UserResponse
  userSpecialPlanets: UserSpecialPlanetsResponse
}
export const getUserAndUserSpecialPlanets = async (
  address: string
): Promise<UserAndUserSpecialPlanetsResponse> => {
  const response = await chains.loom
    .specialPlanetController()
    .methods.getPlanets(address)
    .call()

  return {
    user: [response.confirmedGold, response.goldConfirmedAt],
    userSpecialPlanets: [
      response.ids,
      response.kinds,
      response.paramRates,
      response.times,
      response.axialCoordinates,
      response.artSeeds
    ]
  }
}
