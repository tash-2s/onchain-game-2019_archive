import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../../types/rootTypes"
import { Users } from "../../components/routed/Users"
import { UsersActions } from "../../actions/routed/UsersActions"
import { CommonActions } from "../../actions/CommonActions"

const mapStateToProps = (state: RootState) => {
  return { common: state.common, users: state.routed.users }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    commonActions: new CommonActions(dispatch),
    usersActions: new UsersActions(dispatch)
  }
}

export type UsersProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const UsersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Users)
