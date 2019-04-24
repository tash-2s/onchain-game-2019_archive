import { NormalPlanet } from "../types/commonTypes"

export const NormalPlanetsData: NormalPlanet[] = [
  { id: 1, kind: "residence", param: 1, priceGold: 3 },
  { id: 2, kind: "goldvein", param: 1, priceGold: 3 },
  { id: 3, kind: "residence", param: 2, priceGold: 6 },
  { id: 4, kind: "goldvein", param: 2, priceGold: 6 },
  { id: 5, kind: "residence", param: 3, priceGold: 9 },
  { id: 6, kind: "goldvein", param: 3, priceGold: 9 }
]

export const getNormalPlanet = (id: number) => {
  const p = NormalPlanetsData.find(p => p.id === id)

  if (!p) {
    throw new Error("unknown planet: " + id)
  }

  return p
}
