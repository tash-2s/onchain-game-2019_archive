import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../reducers/rootReducer"
import { App } from "../components/App"

import { AppActions } from "../actions/AppActions"
import { CurrentUserActions } from "../actions/CurrentUserActions"
import { TemplateUIActions } from "../actions/TemplateUIActions"

const mapStateToProps = (state: RootState) => {
  return {
    app: state.app,
    currentUser: state.currentUser,
    templateUI: state.templateUI
  }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    appActions: new AppActions(dispatch),
    currentUserActions: new CurrentUserActions(dispatch),
    templateUIActions: new TemplateUIActions(dispatch)
  }
}

export type AppProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
