import { NormalPlanet } from "../types/commonTypes"

let id = 1
let param = 1
const residenceAndGoldvein: NormalPlanet[] = []
while (id <= 16) {
  residenceAndGoldvein.push(
    { id: id++, kind: "residence", param: param, priceGold: param * 3 },
    { id: id++, kind: "goldvein", param: param, priceGold: param * 3 }
  )
  param += 2
}

export const NormalPlanetsData: NormalPlanet[] = residenceAndGoldvein.concat([
  { id: 101, kind: "technology", param: 2, priceGold: 8 },
  { id: 102, kind: "technology", param: 3, priceGold: 12 }
])

export const getNormalPlanet = (id: number) => {
  const p = NormalPlanetsData.find(p => p.id === id)

  if (!p) {
    throw new Error("unknown planet: " + id)
  }

  return p
}
