import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../reducers/rootReducer"
import { computeUserState } from "../computers/userComputer"
import { computeTimeState } from "../computers/timeComputer"
import { UserPage } from "../components/UserPage"
import { UserActions } from "../actions/UserActions"
import { UserPageUiActions } from "../actions/UserPageUiActions"

const mapStateToProps = (state: RootState) => {
  const time = computeTimeState(state.time)

  return {
    route: state.app.route,
    currentUser: state.currentUser,
    time: time,
    userPageUi: state.userPageUi,
    user: computeUserState(state.user, time.now)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    userPageUiActions: new UserPageUiActions(dispatch),
    userActions: new UserActions(dispatch)
  }
}

export type UserDispatchProps = ReturnType<typeof mapDispatchToProps>
export type UserProps = ReturnType<typeof mapStateToProps> & UserDispatchProps

export const UserPageContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPage)
