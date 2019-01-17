import { PlanetKind } from "../commonTypes"

export interface UserState {
  targetUser: TargetUserState | null
}

export interface TargetUserState {
  id: string
  gold: { confirmed: number; confirmedAt: number; ongoing: number }
  userNormalPlanets: Array<{
    normalPlanetId: number
    rank: number
    rankupedAt: number | null
    paramMemo: number
    planetKindMirror: PlanetKind
  }>
  population: number
  goldPower: number
  goldPerSec: number
}
