export interface UserState {
  targetUser: TargetUserState | null
}

export interface TargetUserState {
  id: string
  gold: number
  normalPlanets: Array<{ normalPlanetId: number }>
}
