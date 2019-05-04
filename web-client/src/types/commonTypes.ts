export interface CommonState {
  route: RouteState
  currentUser: { address: string } | null
  isLoading: boolean
  isError: boolean
  loomTimeDifference: number
}

export interface RouteState {
  id: RouteId
  params: Array<string>
}

interface NormalPlanetBase {
  id: number
  priceGold: number
}

interface NormalNonMagicPlanet extends NormalPlanetBase {
  kind: "residence" | "goldvein" | "technology"
  param: number
}

interface NormalMagicPlanet extends NormalPlanetBase {
  kind: "magic"
  hogeParam: "todo"
}

export type NormalPlanet = NormalNonMagicPlanet | NormalMagicPlanet

export type PlanetKind = NormalNonMagicPlanet["kind"] | NormalMagicPlanet["kind"]

// ref. https://stackoverflow.com/questions/44480644/typescript-string-union-to-string-array
type Lit = string | number | boolean | undefined | null | void | {}
const tuple = <T extends Lit[]>(...args: T) => args
// this is a type file, so this is added `_` to name
export const _routeIds = tuple("/", "/users", "/:address", "/not_found")
type RouteTuple = typeof _routeIds
export type RouteId = RouteTuple[number]
