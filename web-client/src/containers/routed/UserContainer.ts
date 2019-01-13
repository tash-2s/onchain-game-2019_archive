import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { State } from "../../types/types"
import { User } from "../../components/routed/User"
import { UserActions } from "../../actions/routed/UserActions"
import { CommonActions } from "../../actions/CommonActions"

const mapStateToProps = (state: State) => {
  return { common: state.common, user: state.routed.user }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    commonActions: new CommonActions(dispatch),
    userActions: new UserActions(dispatch)
  }
}

export type UserProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

export const UserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(User)
