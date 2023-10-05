import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../reducers/rootReducer"
import { UsersPage } from "../components/UsersPage"
import { UsersActions } from "../actions/UsersActions"

const mapStateToProps = (state: RootState) => {
  return { users: state.users }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    usersActions: new UsersActions(dispatch)
  }
}

export type UsersProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const UsersPageContainer = connect(mapStateToProps, mapDispatchToProps)(UsersPage)
