import BN from "bn.js"

import { PlanetKind } from "../constants"

import RawNormalPlanets from "./NormalPlanets.json"

interface NormalPlanet {
  id: number
  kind: PlanetKind
  paramCommonLogarithm: number
  priceGoldCommonLogarithm: number
  param: BN
  priceGold: BN
  artSeed: BN
}

export const NormalPlanets: Array<NormalPlanet> = RawNormalPlanets.map(p => ({
  ...p,
  kind: p.kind as PlanetKind,
  param: new BN(10).pow(new BN(p.paramCommonLogarithm)),
  priceGold: new BN(10).pow(new BN(p.priceGoldCommonLogarithm)),
  artSeed: new BN(`${p.id - 1}`, 10)
}))

export const initialNormalPlanetIds = [1, 2]

export const getNormalPlanet = (id: number) => {
  const p = NormalPlanets.find(p => p.id === id)

  if (!p) {
    throw new Error("unknown planet: " + id)
  }

  return p
}
