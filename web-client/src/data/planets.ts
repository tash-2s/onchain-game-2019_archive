import { NormalPlanet } from "../types/commonTypes"

export const NormalPlanetsData: NormalPlanet[] = [
  { id: 1, kind: "residence", param: 0, priceGold: 0 },
  { id: 2, kind: "goldvein", param: 1, priceGold: 1 },
  { id: 3, kind: "residence", param: 2, priceGold: 4 },
  { id: 4, kind: "goldvein", param: 3, priceGold: 5 },
  { id: 5, kind: "residence", param: 4, priceGold: 9 },
  { id: 6, kind: "goldvein", param: 5, priceGold: 10 },
  { id: 7, kind: "residence", param: 6, priceGold: 13 },
  { id: 8, kind: "goldvein", param: 7, priceGold: 14 },
  { id: 9, kind: "residence", param: 8, priceGold: 18 },
  { id: 10, kind: "goldvein", param: 9, priceGold: 19 },
  { id: 11, kind: "residence", param: 10, priceGold: 22 },
  { id: 12, kind: "goldvein", param: 11, priceGold: 23 },
  { id: 13, kind: "technology", param: 2, priceGold: 3 },
  { id: 14, kind: "technology", param: 3, priceGold: 4 },
  { id: 15, kind: "technology", param: 4, priceGold: 5 }
]

export const getNormalPlanet = (id: number) => {
  const p = NormalPlanetsData.find(p => p.id === id)

  if (!p) {
    throw new Error("unknown planet: " + id)
  }

  return p
}
