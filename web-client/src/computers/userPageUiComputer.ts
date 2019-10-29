import { UserPageUiState } from "../reducers/userPageUiReducer"
import { ComputedUserState } from "./userComputer"

export type ComputedUserPageUiState = ReturnType<typeof computeUserPageUiState>

export const computeUserPageUiState = (
  state: UserPageUiState,
  targetUser: ComputedUserState["targetUser"]
) => {
  if (!targetUser || state.selectedUserPlanetViewKind === "map") {
    return { ...state, listedUserNormalPlanets: [], batchRankupable: [] }
  }

  const listedUserNormalPlanets = targetUser.userNormalPlanets
    .filter(up => {
      if (state.selectedPlanetKind === "all") {
        return true
      }
      return up.planet.kind === state.selectedPlanetKind
    })
    .sort((a, b) => {
      switch (state.selectedUserPlanetSortKind) {
        case "Newest":
          return b.createdAt - a.createdAt
        case "Oldest":
          return a.createdAt - b.createdAt
        default:
          throw new Error("undefined sort kind")
      }
    })

  const batchRankupable: Array<{ userNormalPlanetId: string; targetRank: number }> = []
  let gold = targetUser.gold
  for (const up of listedUserNormalPlanets) {
    if (up.rankupableCount > 0) {
      const requiredGold = up.requiredGoldForBulkRankup
      if (gold.gte(requiredGold)) {
        batchRankupable.push({
          userNormalPlanetId: up.id,
          targetRank: up.rank + up.rankupableCount
        })
        gold = gold.sub(requiredGold)
      }
    }
  }

  return { ...state, listedUserNormalPlanets, batchRankupable }
}
