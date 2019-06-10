import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../../reducers/rootReducer"
import { computeUserState } from "../../computers/userComputer"
import { computeTimeState } from "../../computers/timeComputer"
import { User } from "../../components/routed/User"
import { UserActions } from "../../actions/routed/UserActions"
import { UserPageUiActions } from "../../actions/UiActions"

const mapStateToProps = (state: RootState) => {
  const time = computeTimeState(state.time)

  return {
    route: state.app.route,
    currentUser: state.currentUser,
    time: time,
    userPageUi: state.ui.userPage,
    user: computeUserState(state.routed.user, time.now)
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

export const UserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(User)
