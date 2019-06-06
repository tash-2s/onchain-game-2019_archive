export interface UiState {
  userPage: {
    selectedUserPlanetsTab: "map" | "list"
    selectedNormalPlanetId: number | null
    planetListVisibility: boolean
    selectedUserPlanetId: string | null
  }
}
