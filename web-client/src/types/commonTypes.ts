export interface RouteState {
  id: RouteId
  params: Array<string>
}

export const planetKinds = ["residence", "goldmine", "technology"] as const
export type PlanetKind = (typeof planetKinds)[number]

export const routeIds = ["/", "/users", "/:address", "/about", "/not_found"] as const
export type RouteId = (typeof routeIds)[number]
