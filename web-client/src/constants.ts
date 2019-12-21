export const asteriskKinds = ["residence", "goldmine", "technology"] as const
export type AsteriskKind = typeof asteriskKinds[number]
export const asteriskKindNumToKind = (kindNum: number) => {
  if (kindNum > asteriskKinds.length) {
    throw new Error("invalid kindNum")
  }
  return asteriskKinds[kindNum - 1]
}
export const asteriskKindsWithAll = ["all", "residence", "goldmine", "technology"] as const
export type AsteriskKindWithAll = typeof asteriskKindsWithAll[number]

export const routeIds = [
  "/",
  "/users",
  "/:address",
  "/about",
  "/tradable_asterisk_token_metadata/:fields",
  "/not_found"
] as const
export type RouteId = typeof routeIds[number]
export interface RouteState {
  id: RouteId
  params: Array<string>
}

export const userPageViewKinds = ["main", "tokens"] as const
export type UserPageViewKind = typeof userPageViewKinds[number]

export const userAsterisksViewKinds = ["map", "list"] as const
export type UserAsterisksViewKind = typeof userAsterisksViewKinds[number]

export const userAsterisksSortKinds = ["Newest", "Oldest"] as const
export type UserAsterisksSortKind = typeof userAsterisksSortKinds[number]

export const maxSelectableAsteriskHexCount = 50
