import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../../reducers/rootReducer"
import { Users } from "../../components/routed/Users"
import { UsersActions } from "../../actions/routed/UsersActions"

const mapStateToProps = (state: RootState) => {
  return { users: state.routed.users }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    usersActions: new UsersActions(dispatch)
  }
}

export type UsersProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const UsersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Users)
