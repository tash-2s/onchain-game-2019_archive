export const planetKinds = ["residence", "goldmine", "technology"] as const
export type PlanetKind = (typeof planetKinds)[number]
export const planetKindNumToKind = (kindNum: number) => {
  if (kindNum > planetKinds.length) {
    throw new Error("invalid kindNum")
  }
  return planetKinds[kindNum - 1]
}
export const planetKindsWithAll = ["all", "residence", "goldmine", "technology"] as const
export type PlanetKindWithAll = (typeof planetKindsWithAll)[number]

export const routeIds = [
  "/",
  "/users",
  "/:address",
  "/about",
  "/special_planet_token_metadata/:fields",
  "/not_found"
] as const
export type RouteId = (typeof routeIds)[number]
export interface RouteState {
  id: RouteId
  params: Array<string>
}

export const userPageViewKinds = ["main", "tokens"] as const
export type UserPageViewKind = (typeof userPageViewKinds)[number]

export const userPlanetsViewKinds = ["map", "list"] as const
export type UserPlanetsViewKind = (typeof userPlanetsViewKinds)[number]

export const userPlanetsSortKinds = ["Newest", "Oldest"] as const
export type UserPlanetsSortKind = (typeof userPlanetsSortKinds)[number]
