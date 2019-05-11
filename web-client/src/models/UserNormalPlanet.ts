import BN from "bn.js"

import { UserState, TargetUserState, UserNormalPlanetType } from "../types/routed/userTypes"
import { NormalPlanet } from "../types/commonTypes"
import { getNormalPlanet } from "../data/planets"
import { Time } from "../models/time"

export class UserNormalPlanet extends UserNormalPlanetType {
  normalPlanet: NormalPlanet

  constructor(obj: UserNormalPlanetType) {
    super(obj)
    this.normalPlanet = getNormalPlanet(this.normalPlanetId)
  }

  isRankupable = (gold: BN, time: number, techPower: BN): boolean => {
    return (
      !this.isMaxRank() &&
      this.remainingSecForRankup(time, techPower) <= 0 &&
      this.requiredGoldForRankup().lte(gold)
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

  remainingSecForRankup = (time: number, techPower: BN) => {
    return Math.max(
      new BN(this.remainingSecForRankupWithoutTechPower(time)).sub(techPower).toNumber(),
      0
    )
  }

  remainingSecForRankupWithoutTechPower = (time: number) => {
    const prevDiffSec = time - this.rankupedAt
    const remainingSec = this.requiredSecForRankup() - prevDiffSec

    return Math.max(remainingSec, 0)
  }

  requiredSecForRankup = (): number => {
    return UserNormalPlanet.requiredSecForRankup(this.rank)
  }

  static requiredSecForRankup = (rank: number) => {
    let i = 1
    let memo = 300
    while (i < rank) {
      memo = Math.floor((memo * 14) / 10)
      i++
    }
    return memo
  }

  requiredGoldForRankup = () => {
    const previousRank = new BN(this.rank - 1)
    return new BN(10)
      .pow(new BN(this.planetPriceGold()))
      .mul(new BN(13).pow(previousRank))
      .div(new BN(10).pow(previousRank))
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
