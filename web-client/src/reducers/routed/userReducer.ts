import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UserActions } from "../../actions/routed/UserActions"
import { UserState, TargetUserState } from "../../types/routed/userTypes"
import { NormalPlanetsData } from "../../data/planets"

const initialState: UserState = {
  targetUser: null
}

export const userReducer = reducerWithInitialState(initialState)
  .case(UserActions.getTargetUser.started, (state, params) => ({
    ...state
  }))
  // .case(UserActions.getTargetUser.failed, (state, { params, error }) => ({
  //   ...state
  // }))
  .case(UserActions.getTargetUser.done, (state, { params, result }) => ({
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
  .case(UserActions.clearTargetUser, state => ({
    ...state,
    targetUser: null
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
        switch (p.kind) {
          case "residence":
            totalResidenceParam += p.param
            break
          case "goldvein":
            totalGoldveinParam += p.param
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
