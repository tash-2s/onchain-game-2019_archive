export interface UiState {
  userPage: {
    selectedUserPlanetViewType: "map" | "list"
    selectedNormalPlanetId: number | null
    planetListVisibility: boolean
    selectedUserPlanetId: string | null
  }
}
