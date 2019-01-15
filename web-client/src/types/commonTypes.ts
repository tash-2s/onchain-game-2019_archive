export interface CommonState {
  route: RouteState
  currentUser: "todo user info"
  isError: boolean
}

export interface RouteState {
  id: RouteId
  params: Array<string>
}

// ref. https://stackoverflow.com/questions/44480644/typescript-string-union-to-string-array
type Lit = string | number | boolean | undefined | null | void | {}
const tuple = <T extends Lit[]>(...args: T) => args
// this is a type file, so this is added `_` to name
export const _routeIds = tuple("/", "/test", "/users/:id", "/not_found")
type RouteTuple = typeof _routeIds
export type RouteId = RouteTuple[number]
