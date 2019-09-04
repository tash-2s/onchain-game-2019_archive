import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../reducers/rootReducer"
import { computeUserState } from "../computers/userComputer"
import { computeTimeState } from "../computers/timeComputer"
import { UserPage } from "../components/UserPage"
import { UserActions } from "../actions/UserActions"
import { UserActionsForNormalPlanet } from "../actions/UserActionsForNormalPlanet"
import { UserActionsForSpecialPlanet } from "../actions/UserActionsForSpecialPlanet"
import { UserPageUiActions } from "../actions/UserPageUiActions"

const mapStateToProps = (state: RootState) => {
  const time = computeTimeState(state.time)

  return {
    route: state.app.route,
    currentUser: state.currentUser,
    time: time,
    user: computeUserState(state.user, time.now),
    userPageUi: state.userPageUi
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    userActions: {
      main: new UserActions(dispatch),
      normal: new UserActionsForNormalPlanet(dispatch),
      special: new UserActionsForSpecialPlanet(dispatch)
    },
    userPageUiActions: new UserPageUiActions(dispatch)
  }
}

export type UserPageActionsProps = ReturnType<typeof mapDispatchToProps>
export type UserPageProps = ReturnType<typeof mapStateToProps> & UserPageActionsProps

export const UserPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPage)
