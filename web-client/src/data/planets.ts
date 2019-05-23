import BN from "bn.js"
import { NormalPlanet } from "../types/commonTypes"

let id = 1
let param = 1
const residenceAndGoldvein: NormalPlanet[] = []
while (id <= 16) {
  residenceAndGoldvein.push(
    {
      id: id++,
      kind: "residence",
      paramCommonLogarithm: param,
      priceGoldCommonLogarithm: param * 3
    },
    { id: id++, kind: "goldvein", paramCommonLogarithm: param, priceGoldCommonLogarithm: param * 3 }
  )
  param += 2
}

const _NormalPlanetsData: NormalPlanet[] = residenceAndGoldvein.concat([
  { id: 101, kind: "technology", paramCommonLogarithm: 2, priceGoldCommonLogarithm: 8 },
  { id: 102, kind: "technology", paramCommonLogarithm: 3, priceGoldCommonLogarithm: 12 }
])

export const NormalPlanetsData = _NormalPlanetsData.map(p => {
  if (p.kind === "magic") {
    throw new Error("not supported")
  }

  return {
    ...p,
    param: new BN(10).pow(new BN(p.paramCommonLogarithm)),
    priceGold: new BN(10).pow(new BN(p.priceGoldCommonLogarithm))
  }
})

export const initialPlanetIds = [1, 2]

export const getNormalPlanet = (id: number) => {
  const p = NormalPlanetsData.find(p => p.id === id)

  if (!p) {
    throw new Error("unknown planet: " + id)
  }

  return p
}
