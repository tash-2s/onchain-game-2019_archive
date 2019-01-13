export interface CommonState {
  route: RouteIdWithParams
  currentUser: "todo user info"
}

export interface RouteIdWithParams {
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
