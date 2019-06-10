import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../reducers/rootReducer"
import { computeCommonState } from "../computers/commonComputer"
import { App } from "../components/App"

import { CommonActions } from "../actions/CommonActions"
import { CurrentUserActions } from "../actions/CurrentUserActions"
import { CommonUiActions } from "../actions/UiActions"

const mapStateToProps = (state: RootState) => {
  return {
    common: computeCommonState(state.common),
    currentUser: state.currentUser,
    commonUi: state.ui.common
  }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    commonActions: new CommonActions(dispatch),
    currentUserActions: new CurrentUserActions(dispatch),
    commonUiActions: new CommonUiActions(dispatch)
  }
}

export type AppProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
