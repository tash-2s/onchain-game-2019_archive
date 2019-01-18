import {
  UserState,
  TargetUserState,
  UserNormalPlanetType
} from "../types/routed/userTypes"

export class UserNormalPlanet extends UserNormalPlanetType {
  isRankupable = (): boolean => {
    return true
  }
}

export interface ExtendedUserState extends UserState {
  targetUser: ExtendedTargetUserState | null
}

export interface ExtendedTargetUserState extends TargetUserState {
  userNormalPlanets: Array<UserNormalPlanet>
}
