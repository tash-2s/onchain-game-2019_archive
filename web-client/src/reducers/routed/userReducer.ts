import { reducerWithInitialState } from "typescript-fsa-reducers"
import {
  UserActions,
  TargetUserApiResponse
} from "../../actions/routed/UserActions"
import { UserState, TargetUserState } from "../../types/routed/userTypes"
import { NormalPlanetsData } from "../../data/planets"

const initialState: UserState = {
  targetUser: null
}

export const userReducer = reducerWithInitialState(initialState)
  // .case(UserActions.setTargetUser.started, (state, params) => ({
  //   ...state
  // }))
  // .case(UserActions.getTargetUser.failed, (state, { params, error }) => ({
  //   ...state
  // }))
  .case(UserActions.setTargetUser.done, (state, { params, result }) => ({
    ...state,
    targetUser: getTargetUser(result)
  }))
  .case(UserActions.updateTargetUserOngoings, state => {
    if (!state.targetUser) {
      return state
    }

    return {
      ...state,
      targetUser: {
        ...state.targetUser,
        gold: {
          ...state.targetUser.gold,
          ongoing: calculateOngoingGold(
            state.targetUser.gold,
            state.targetUser.userNormalPlanets
          )
        }
      }
    }
  })
  .case(UserActions.clearTargetUser, state => ({
    ...state,
    targetUser: null
  }))
  .build()

const getTargetUser = (result: TargetUserApiResponse): TargetUserState => {
  const [userResidencePlanets, userGoldveinPlanets] = processUserNormalPlanets(
    result.userNormalPlanets
  )
  const userPlanets = userResidencePlanets.concat(userGoldveinPlanets)
  const population = userResidencePlanets
    .map(up => up.paramMemo)
    .reduce((acc, cur) => acc + cur, 0)
  const goldPower = userGoldveinPlanets
    .map(up => up.paramMemo)
    .reduce((acc, cur) => acc + cur, 0)

  return {
    ...result,
    gold: {
      ...result.gold,
      ongoing: calculateOngoingGold(result.gold, userPlanets)
    },
    userNormalPlanets: userPlanets,
    population: population,
    goldPower: goldPower,
    goldPerSec: population * goldPower
  }
}

const processUserNormalPlanets = (
  userPlanets: TargetUserApiResponse["userNormalPlanets"]
): [
  TargetUserState["userNormalPlanets"],
  TargetUserState["userNormalPlanets"]
] => {
  const userResidencePlanets: TargetUserState["userNormalPlanets"] = []
  const userGoldveinPlanets: TargetUserState["userNormalPlanets"] = []

  userPlanets.forEach(up => {
    const p = NormalPlanetsData.find(p => p.id === up.normalPlanetId)

    if (!p) {
      throw new Error("unknown planet: " + up.normalPlanetId)
    }

    const rate = 1 * 1.2 ** (up.rank - 1)
    let param = 0

    switch (p.kind) {
      case "residence":
      case "goldvein":
        param = Math.floor(p.param * rate)
    }

    const newUp = {
      ...up,
      rateMemo: rate,
      paramMemo: param,
      planetKindMirror: p.kind,
      planetPriceGoldMirror: p.priceGold
    }

    switch (p.kind) {
      case "residence":
        userResidencePlanets.push(newUp)
        break
      case "goldvein":
        userGoldveinPlanets.push(newUp)
        break
    }
  })

  return [userResidencePlanets, userGoldveinPlanets]
}

const calculateOngoingGold = (
  gold: { confirmed: number; confirmedAt: number },
  userNormalPlanets: TargetUserState["userNormalPlanets"]
): number => {
  const goldPerSec = (ups => {
    let totalResidenceParam = 0
    let totalGoldveinParam = 0
    ups.forEach(up => {
      switch (up.planetKindMirror) {
        case "residence":
          totalResidenceParam += up.paramMemo
          break
        case "goldvein":
          totalGoldveinParam += up.paramMemo
          break
      }
    })
    return totalResidenceParam * totalGoldveinParam
  })(userNormalPlanets)

  const diffSec = Math.floor(Date.now() / 1000) - gold.confirmedAt

  return gold.confirmed + goldPerSec * diffSec
}
