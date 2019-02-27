import { UserState, TargetUserState, UserNormalPlanetType } from "../types/routed/userTypes"
import { NormalPlanet } from "../types/commonTypes"
import { getNormalPlanet } from "../data/planets"
import { Time } from "../misc/time"

export class UserNormalPlanet extends UserNormalPlanetType {
  normalPlanet: NormalPlanet

  constructor(obj: UserNormalPlanetType) {
    super(obj)
    this.normalPlanet = getNormalPlanet(this.normalPlanetId)
  }

  isRankupable = (gold: number, time: number, techPower: number): boolean => {
    return (
      !this.isMaxRank() &&
      this.remainingSecForRankup(time, techPower) <= 0 &&
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
    return Time.unixtimeToDateString(unixtime)
  }

  remainingSecForRankup = (time: number, techPower: number) => {
    return Math.max(this.remainingSecForRankupWithoutTechPower(time) - techPower, 0)
  }

  remainingSecForRankupWithoutTechPower = (time: number) => {
    const prevDiffSec = time - this.rankupedAt
    const remainingSec = this.requiredSecForRankup() - prevDiffSec

    return Math.max(remainingSec, 0)
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

  createdAtString = () => Time.unixtimeToDateString(this.createdAt)
  rankupedAtString = () => Time.unixtimeToDateString(this.rankupedAt)
}

export interface ExtendedUserState extends UserState {
  targetUser: ExtendedTargetUserState | null
}

export interface ExtendedTargetUserState extends TargetUserState {
  userNormalPlanets: Array<UserNormalPlanet>
}
