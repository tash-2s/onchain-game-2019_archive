import BN from "bn.js"

import { UserState, TargetUserState, UserNormalPlanetType } from "../types/routed/userTypes"
import { NormalPlanet } from "../types/commonTypes"
import { getNormalPlanet } from "../data/planets"
import { Time } from "../models/time"

export class UserNormalPlanet extends UserNormalPlanetType {
  normalPlanet: NormalPlanet
  paramMemo: BN
  now: number
  gold: BN

  constructor(obj: UserNormalPlanetType & { paramMemo: BN }, now: number, gold: BN) {
    super(obj)
    this.normalPlanet = getNormalPlanet(this.normalPlanetId)
    this.paramMemo = obj.paramMemo
    this.now = now
    this.gold = gold
  }

  isRankupable = (techPower: number): boolean => {
    return (
      !this.isMaxRank() &&
      this.remainingSecForRankup(techPower) <= 0 &&
      this.requiredGoldForRankup().lte(this.gold)
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

  remainingSecForRankup = (techPower: number) => {
    return Math.max(this.remainingSecForRankupWithoutTechPower() - techPower, 0)
  }

  remainingSecForRankupWithoutTechPower = () => {
    const prevDiffSec = this.now - this.rankupedAt
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
    return this.normalPlanet.priceGoldCommonLogarithm
  }

  rankuped = () => this.now - this.rankupedAt
  created = () => this.now - this.createdAt
}
