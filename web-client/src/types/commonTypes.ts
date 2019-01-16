export interface CommonState {
  route: RouteState
  currentUser: { id: string } | null
  isError: boolean
}

export interface RouteState {
  id: RouteId
  params: Array<string>
}

interface NormalNonMagicPlanet {
  id: number
  kind: "residence" | "goldvein" | "technology"
  param: number
}

interface NormalMagicPlanet {
  id: number
  kind: "magic"
  hogeParam: "todo"
}

export type NormalPlanet = NormalNonMagicPlanet | NormalMagicPlanet

// type PlanetKind = NormalNonMagicPlanet['kind'] | NormalMagicPlanet['kind']

// ref. https://stackoverflow.com/questions/44480644/typescript-string-union-to-string-array
type Lit = string | number | boolean | undefined | null | void | {}
const tuple = <T extends Lit[]>(...args: T) => args
// this is a type file, so this is added `_` to name
export const _routeIds = tuple("/", "/users", "/users/:id", "/not_found")
type RouteTuple = typeof _routeIds
export type RouteId = RouteTuple[number]
