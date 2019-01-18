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
  id!: string
  normalPlanetId!: number
  rank!: number
  createdAt!: number
  rankupedAt!: number | null
  isProcessing!: boolean // this is used for waiting tx and so on
  rateMemo!: number
  paramMemo!: number
  planetKindMirror!: PlanetKind
  planetPriceGoldMirror!: number

  // this is not used when this behave as a type
  constructor(obj: UserNormalPlanetType) {
    Object.assign(this, obj)
  }
}
