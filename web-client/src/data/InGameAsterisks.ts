import BN from "bn.js"

import { AsteriskKind } from "../constants"

import RawInGameAsterisks from "./InGameAsterisks.json"

interface InGameAsterisk {
  id: number
  kind: AsteriskKind
  paramCommonLogarithm: number
  priceGoldCommonLogarithm: number
  param: BN
  priceGold: BN
  artSeed: BN
}

export const InGameAsterisks: Array<InGameAsterisk> = RawInGameAsterisks.map(p => ({
  ...p,
  kind: p.kind as AsteriskKind,
  param: new BN(10).pow(new BN(p.paramCommonLogarithm)),
  priceGold: new BN(10).pow(new BN(p.priceGoldCommonLogarithm)),
  artSeed: new BN(`${p.id - 1}`, 10)
}))

export const initialInGameAsteriskIds = [1, 2]

export const getInGameAsterisk = (id: number) => {
  const p = InGameAsterisks.find(p => p.id === id)

  if (!p) {
    throw new Error("unknown asterisk: " + id)
  }

  return p
}
