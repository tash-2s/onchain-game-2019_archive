import BN from "bn.js"

import { PlanetKind } from "../constants"

interface NormalPlanet {
  id: number
  kind: PlanetKind
  paramCommonLogarithm: number
  priceGoldCommonLogarithm: number
  artSeedStr: string
}

let id = 1
let param = 1
let planets: NormalPlanet[] = []
while (id <= 16) {
  planets.push(
    {
      id: id++,
      kind: "residence",
      paramCommonLogarithm: param,
      priceGoldCommonLogarithm: param * 3,
      artSeedStr: `${id - 1}`
    }
  )
  param += 1
  planets.push(
    {
      id: id++,
      kind: "goldmine",
      paramCommonLogarithm: param,
      priceGoldCommonLogarithm: param * 3,
      artSeedStr: `${id - 1}`
    }
  )
  param += 1
}

planets = planets.concat([
  {
    id: 101,
    kind: "technology",
    paramCommonLogarithm: 2,
    priceGoldCommonLogarithm: 8,
    artSeedStr: "101"
  },
  {
    id: 102,
    kind: "technology",
    paramCommonLogarithm: 3,
    priceGoldCommonLogarithm: 12,
    artSeedStr: "102"
  }
])

export const NormalPlanets = planets.map(p => ({
  ...p,
  param: new BN(10).pow(new BN(p.paramCommonLogarithm)),
  priceGold: new BN(10).pow(new BN(p.priceGoldCommonLogarithm)),
  artSeed: new BN(p.artSeedStr, 10)
}))

export const initialNormalPlanetIds = [1, 2]

export const getNormalPlanet = (id: number) => {
  const p = NormalPlanets.find(p => p.id === id)

  if (!p) {
    throw new Error("unknown planet: " + id)
  }

  return p
}
