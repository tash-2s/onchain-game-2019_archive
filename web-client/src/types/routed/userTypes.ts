export interface UserState {
  targetUser: TargetUserState | null
}

export interface TargetUserState {
  address: string
  gold: { confirmed: string; confirmedAt: number }
  userNormalPlanets: Array<UserNormalPlanet>
}

interface UserNormalPlanet {
  id: string
  normalPlanetId: number
  rank: number
  createdAt: number
  rankupedAt: number
  axialCoordinateQ: number
  axialCoordinateR: number
}
