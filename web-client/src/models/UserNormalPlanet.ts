import {
  UserState,
  TargetUserState,
  UserNormalPlanetType
} from "../types/routed/userTypes"

export class UserNormalPlanet extends UserNormalPlanetType {
  isRankupButtonAvailable = (): boolean => {
    return this.isMaxRank()
  }

  isRankupable = (gold: number): boolean => {
    return (
      this.isMaxRank() &&
      this.remainingSecForRankup() <= 0 &&
      !this.isProcessing &&
      this.requiredGoldForRankup() <= gold
    )
  }

  isMaxRank = (): boolean => {
    return this.rank >= 30
  }

  remainingSecForRankup = (): number => {
    const prevDiffSec =
      Math.floor(Date.now() / 1000) - (this.rankupedAt || this.createdAt)
    const remainingSec = this.requiredSecForRankup() - prevDiffSec

    if (remainingSec <= 0) {
      return 0
    } else {
      return remainingSec
    }
  }

  requiredSecForRankup = (): number => {
    return 10 * 60 * this.rateMemo // 10 min * rate
  }

  requiredGoldForRankup = (): number => {
    return (this.planetPriceGoldMirror / 5) * this.rateMemo
  }
}

export interface ExtendedUserState extends UserState {
  targetUser: ExtendedTargetUserState | null
}

export interface ExtendedTargetUserState extends TargetUserState {
  userNormalPlanets: Array<UserNormalPlanet>
}
