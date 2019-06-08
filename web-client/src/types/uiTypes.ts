import { PlanetKind } from "./commonTypes"

const tuple = <T extends Array<string>>(...args: T) => args
export const sortKinds = tuple("Newest", "Oldest")
type SortKind = (typeof sortKinds)[number]

export interface UiState {
  userPage: {
    selectedUserPlanetViewType: "map" | "list"
    selectedNormalPlanetId: number | null
    planetListVisibilityOnMobile: boolean
    selectedUserPlanetId: string | null
    selectedUserPlanetKindForUserPlanetList: "all" | PlanetKind
    selectedSortKindForUserPlanetList: SortKind
  }
  common: {
    activatedNavbarMenuOnMobile: boolean
  }
}
