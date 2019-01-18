import { PlanetKind } from "../commonTypes"

export interface UserState {
  targetUser: TargetUserState | null
}

export interface TargetUserState {
  id: string
  gold: { confirmed: number; confirmedAt: number; ongoing: number }
  userNormalPlanets: Array<UserNormalPlanetType>
  population: number
  goldPower: number
  goldPerSec: number
}

// This is used as object's type for store, and used as class for elsewhere
export class UserNormalPlanetType {
  normalPlanetId: number
  rank: number
  rankupedAt: number | null
  paramMemo: number
  planetKindMirror: PlanetKind
  // isProcessing: boolean // this is used for waiting tx and so on

  // this is not used when this behave as a type
  constructor(obj: UserNormalPlanetType) {
    this.normalPlanetId = obj.normalPlanetId
    this.rank = obj.rank
    this.rankupedAt = obj.rankupedAt
    this.paramMemo = obj.paramMemo
    this.planetKindMirror = obj.planetKindMirror
  }
}
