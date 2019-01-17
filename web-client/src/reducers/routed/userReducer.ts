import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UserActions } from "../../actions/routed/UserActions"
import { UserState, TargetUserState } from "../../types/routed/userTypes"
import { NormalPlanetsData } from "../../data/planets"

const initialState: UserState = {
  targetUser: null
}

export const userReducer = reducerWithInitialState(initialState)
  .case(UserActions.setTargetUser.started, (state, params) => ({
    ...state
  }))
  // .case(UserActions.getTargetUser.failed, (state, { params, error }) => ({
  //   ...state
  // }))
  .case(UserActions.setTargetUser.done, (state, { params, result }) => ({
    ...state,
    targetUser: {
      id: result.id,
      gold: {
        confirmed: result.gold.confirmed,
        confirmedAt: result.gold.confirmedAt,
        ongoing: calculateOngoingGold(result.gold, result.userNormalPlanets)
      },
      userNormalPlanets: result.userNormalPlanets
    }
  }))
  .case(UserActions.updateTargetUserOngoings, state => {
    if (state.targetUser) {
      return {
        ...state,
        targetUser: {
          id: state.targetUser.id,
          gold: {
            confirmed: state.targetUser.gold.confirmed,
            confirmedAt: state.targetUser.gold.confirmedAt,
            ongoing: calculateOngoingGold(
              state.targetUser.gold,
              state.targetUser.userNormalPlanets
            )
          },
          userNormalPlanets: state.targetUser.userNormalPlanets
        }
      }
    } else {
      return state
    }
  })
  .case(UserActions.clearTargetUser, state => ({
    ...state,
    targetUser: null
  }))
  .build()

const calculateOngoingGold = (
  gold: { confirmed: number; confirmedAt: number },
  userNormalPlanets: TargetUserState["userNormalPlanets"]
): number => {
  const goldPerSec = (ups => {
    let totalResidenceParam = 0
    let totalGoldveinParam = 0
    ups.forEach(up => {
      const p = NormalPlanetsData.find(p => p.id === up.normalPlanetId)
      if (p) {
        const rate = 1 * 1.2 ** (up.rank - 1)
        switch (p.kind) {
          case "residence":
            totalResidenceParam += Math.floor(p.param * rate)
            break
          case "goldvein":
            totalGoldveinParam += Math.floor(p.param * rate)
            break
        }
      } else {
        throw new Error("unknown planet: " + up.normalPlanetId)
      }
    })
    return totalResidenceParam * totalGoldveinParam
  })(userNormalPlanets)

  const diffSec = Math.floor(Date.now() / 1000) - gold.confirmedAt

  return gold.confirmed + goldPerSec * diffSec
}
