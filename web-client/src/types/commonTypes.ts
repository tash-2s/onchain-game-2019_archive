export interface RouteState {
  id: RouteId
  params: Array<string>
}

// ref. https://stackoverflow.com/questions/44480644/typescript-string-union-to-string-array
type Lit = string | number | boolean | undefined | null | void | {}
const tuple = <T extends Lit[]>(...args: T) => args

export const planetKinds = tuple("residence", "goldmine", "technology")
export type PlanetKind = (typeof planetKinds)[number]

export const routeIds = tuple("/", "/users", "/:address", "/about", "/not_found")
type RouteTuple = typeof routeIds
export type RouteId = RouteTuple[number]
