import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../../reducers/rootReducer"
import { computeUserState } from "../../computers/userComputer"
import { computeCommonState } from "../../computers/commonComputer"
import { User } from "../../components/routed/User"
import { UserActions } from "../../actions/routed/UserActions"
import { UserPageUiActions } from "../../actions/UiActions"

const mapStateToProps = (state: RootState) => {
  const common = computeCommonState(state.common)

  return {
    common: common,
    currentUser: state.currentUser,
    userPageUi: state.ui.userPage,
    user: computeUserState(state.routed.user, common.now)
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
