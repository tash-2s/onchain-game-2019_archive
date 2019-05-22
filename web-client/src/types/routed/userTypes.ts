export interface UserState {
  targetUser: TargetUserState | null
}

export interface TargetUserState {
  address: string
  gold: { confirmed: string; confirmedAt: number }
  userNormalPlanets: Array<UserNormalPlanetType>
}

// This is used as object's type for store, and used as class for elsewhere
export class UserNormalPlanetType {
  id!: string
  normalPlanetId!: number
  rank!: number
  createdAt!: number
  rankupedAt!: number
  axialCoordinateQ!: number
  axialCoordinateR!: number

  // this is not used when this behave as a type
  constructor(obj: UserNormalPlanetType) {
    Object.assign(this, obj)
  }
}
