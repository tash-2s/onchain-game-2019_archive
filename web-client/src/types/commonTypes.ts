export interface CommonState {
  route: RouteState
  currentUser: { address: string } | null
  isLoading: boolean
  isError: boolean
  webTime: number
  loomTimeDifference: number
}

export interface RouteState {
  id: RouteId
  params: Array<string>
}

export type PlanetKind = "residence" | "goldmine" | "technology"

export interface NormalPlanet {
  id: number
  kind: PlanetKind
  paramCommonLogarithm: number
  priceGoldCommonLogarithm: number
}

// ref. https://stackoverflow.com/questions/44480644/typescript-string-union-to-string-array
type Lit = string | number | boolean | undefined | null | void | {}
const tuple = <T extends Lit[]>(...args: T) => args
// this is a type file, so this is added `_` to name
export const _routeIds = tuple("/", "/users", "/:address", "/about", "/not_found")
type RouteTuple = typeof _routeIds
export type RouteId = RouteTuple[number]
