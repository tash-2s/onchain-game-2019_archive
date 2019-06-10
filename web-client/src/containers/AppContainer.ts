import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../reducers/rootReducer"
import { App } from "../components/App"

import { AppActions } from "../actions/AppActions"
import { CurrentUserActions } from "../actions/CurrentUserActions"
import { CommonUiActions } from "../actions/UiActions"

const mapStateToProps = (state: RootState) => {
  return {
    app: state.app,
    currentUser: state.currentUser,
    commonUi: state.ui.common
  }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    appActions: new AppActions(dispatch),
    currentUserActions: new CurrentUserActions(dispatch),
    commonUiActions: new CommonUiActions(dispatch)
  }
}

export type AppProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
