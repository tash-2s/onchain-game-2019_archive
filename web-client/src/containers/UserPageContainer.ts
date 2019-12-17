import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../reducers/rootReducer"

import { computeUserState } from "../computers/userComputer"
import { computeTimeState } from "../computers/timeComputer"
import { computeUserPageUIState } from "../computers/userPageUIComputer"

import { UserPage } from "../components/UserPage"

import { UserActions } from "../actions/UserActions"
import { UserActionsForNormalPlanet } from "../actions/UserActionsForNormalPlanet"
import { UserActionsForSpecialPlanet } from "../actions/UserActionsForSpecialPlanet"
import { UserPageUIActions } from "../actions/UserPageUIActions"

const mapStateToProps = (state: RootState) => {
  const time = computeTimeState(state.time)
  const user = computeUserState(state.user, time.now)

  return {
    route: state.app.route,
    currentUser: state.currentUser,
    time: time,
    user: user,
    userPageUI: computeUserPageUIState(state.userPageUI, user.targetUser)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    userActions: {
      main: new UserActions(dispatch),
      normal: new UserActionsForNormalPlanet(dispatch),
      special: new UserActionsForSpecialPlanet(dispatch)
    },
    userPageUIActions: new UserPageUIActions(dispatch)
  }
}

export type UserPageActionsProps = ReturnType<typeof mapDispatchToProps>
export type UserPageProps = ReturnType<typeof mapStateToProps> & UserPageActionsProps

export const UserPageContainer = connect(mapStateToProps, mapDispatchToProps)(UserPage)
