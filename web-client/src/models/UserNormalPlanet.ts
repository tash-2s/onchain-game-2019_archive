import { UserState, TargetUserState, UserNormalPlanetType } from "../types/routed/userTypes"
import { NormalPlanet } from "../types/commonTypes"
import { getNormalPlanet } from "../data/planets"

export class UserNormalPlanet extends UserNormalPlanetType {
  normalPlanet: NormalPlanet

  constructor(obj: UserNormalPlanetType) {
    super(obj)
    this.normalPlanet = getNormalPlanet(this.normalPlanetId)
  }

  isRankupable = (gold: number, date: number): boolean => {
    return (
      !this.isMaxRank() &&
      this.remainingSecForRankup(date) <= 0 &&
      this.requiredGoldForRankup() <= gold
    )
  }

  maxRank = (): number => {
    return 30
  }

  isMaxRank = (): boolean => {
    return this.rank >= this.maxRank()
  }

  rankupAvailableDateString = (): string => {
    const unixtime = this.rankupedAt + this.requiredSecForRankup()
    const date = new Date(unixtime * 1000)
    const dateStringOption = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZoneName: "long"
    }
    const dateString = new Intl.DateTimeFormat(undefined, dateStringOption).format(date)
    return dateString
  }

  remainingSecForRankup = (now: number): number => {
    const prevDiffSec = now - this.rankupedAt
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
    return (this.planetPriceGold() / 5) * this.rateMemo
  }

  planetKind = () => {
    return this.normalPlanet.kind
  }

  planetPriceGold = () => {
    return this.normalPlanet.priceGold
  }
}

export interface ExtendedUserState extends UserState {
  targetUser: ExtendedTargetUserState | null
}

export interface ExtendedTargetUserState extends TargetUserState {
  userNormalPlanets: Array<UserNormalPlanet>
}
