export interface AppState {
  route: RouteIdWithParams
  error: string | null
}

export interface RouteIdWithParams {
  id: RouteId
  params: Array<string>
}

// ref. https://stackoverflow.com/questions/44480644/typescript-string-union-to-string-array
type Lit = string | number | boolean | undefined | null | void | {}
const tuple = <T extends Lit[]>(...args: T) => args
export const _ROUTE_IDS = tuple("/", "/test", "/users/:id", "/not_found") // for re-export from src/constants/
type RouteTuple = typeof _ROUTE_IDS
export type RouteId = RouteTuple[number]
