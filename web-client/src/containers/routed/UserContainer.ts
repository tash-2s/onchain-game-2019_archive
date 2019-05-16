import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../../types/rootTypes"
import { CommonState } from "../../types/commonTypes"

import { computeUserState } from "../../computers/userComputer"
import { User } from "../../components/routed/User"
import { UserActions } from "../../actions/routed/UserActions"
import { CommonActions } from "../../actions/CommonActions"
import { UserPageUiActions } from "../../actions/UiActions"

const mapStateToProps = (state: RootState) => {
  return {
    common: state.common,
    userPageUi: state.ui.userPage,
    user: computeUserState(state.routed.user)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    commonActions: new CommonActions(dispatch),
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
