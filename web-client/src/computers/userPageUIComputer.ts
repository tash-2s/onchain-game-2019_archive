import { UserPageUIState } from "../reducers/userPageUIReducer"
import { ComputedUserState } from "./userComputer"

export type ComputedUserPageUIState = ReturnType<typeof computeUserPageUIState>

export const computeUserPageUIState = (
  state: UserPageUIState,
  targetUser: ComputedUserState["targetUser"]
) => {
  if (!targetUser || state.selectedUserAsterisksViewKind === "map") {
    return { ...state, listedUserInGameAsterisks: [], batchRankupable: [] }
  }

  const listedUserInGameAsterisks = targetUser.userInGameAsterisks
    .filter(up => {
      if (state.selectedAsteriskKindForUserAsteriskList === "all") {
        return true
      }
      return up.asterisk.kind === state.selectedAsteriskKindForUserAsteriskList
    })
    .sort((a, b) => {
      switch (state.selectedSortKindForUserAsteriskList) {
        case "Newest":
          return b.createdAt - a.createdAt
        case "Oldest":
          return a.createdAt - b.createdAt
        default:
          throw new Error("undefined sort kind")
      }
    })

  const batchRankupable: Array<{ userInGameAsteriskId: string; targetRank: number }> = []
  let gold = targetUser.gold
  for (const up of listedUserInGameAsterisks) {
    if (up.rankupableCount > 0) {
      const requiredGold = up.requiredGoldForBulkRankup
      if (gold.gte(requiredGold)) {
        batchRankupable.push({
          userInGameAsteriskId: up.id,
          targetRank: up.rank + up.rankupableCount
        })
        gold = gold.sub(requiredGold)
      }
    }
  }

  return { ...state, listedUserInGameAsterisks, batchRankupable }
}
