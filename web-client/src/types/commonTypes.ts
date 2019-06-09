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

// ref. https://stackoverflow.com/questions/44480644/typescript-string-union-to-string-array
type Lit = string | number | boolean | undefined | null | void | {}
const tuple = <T extends Lit[]>(...args: T) => args

export const planetKinds = tuple("residence", "goldmine", "technology")
export type PlanetKind = (typeof planetKinds)[number]

export interface NormalPlanet {
  id: number
  kind: PlanetKind
  paramCommonLogarithm: number
  priceGoldCommonLogarithm: number
}

export const routeIds = tuple("/", "/users", "/:address", "/about", "/not_found")
type RouteTuple = typeof routeIds
export type RouteId = RouteTuple[number]
