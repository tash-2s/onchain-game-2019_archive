import { NormalPlanet } from "../types/commonTypes"

export const NormalPlanetsData: NormalPlanet[] = [
  { id: 1, kind: "residence", param: 1, priceGold: 3 },
  { id: 2, kind: "goldvein", param: 1, priceGold: 3 }
]

export const getNormalPlanet = (id: number) => {
  const p = NormalPlanetsData.find(p => p.id === id)

  if (!p) {
    throw new Error("unknown planet: " + id)
  }

  return p
}
