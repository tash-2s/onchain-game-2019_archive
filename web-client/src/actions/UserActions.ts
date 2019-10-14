import { AbstractActions } from "./AbstractActions"

import { chains } from "../misc/chains"

import { SpecialPlanetController } from "../chain/clients/loom/SpecialPlanetController"
import {
  getUserSpecialPlanets,
  ReturnTypeOfGetUserSpecialPlanets
} from "../chain/clients/loom/organized"

type ExtractFromPromise<T> = T extends Promise<infer R> ? R : never

export class UserActions extends AbstractActions {
  private static creator = UserActions.getActionCreator()

  static setTargetUser = UserActions.creator<{
    address: string
    user: UserResponse
    userNormalPlanets: UserNormalPlanetsResponse
    userSpecialPlanets: ReturnTypeOfGetUserSpecialPlanets
  }>("setTargetUser")
  setTargetUser = async (address: string) => {
    const [userNormalPlanetsResponse, userSpecialPlanets] = await Promise.all([
      getUserAndUserNormalPlanets(address),
      getUserSpecialPlanets(address)
    ])

    this.dispatch(
      UserActions.setTargetUser({
        address,
        user: userNormalPlanetsResponse.user,
        userNormalPlanets: userNormalPlanetsResponse.userNormalPlanets,
        userSpecialPlanets: userSpecialPlanets
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
