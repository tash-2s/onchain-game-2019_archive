import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../reducers/rootReducer"
import { computeCommonState } from "../computers/commonComputer"
import { App } from "../components/App"
import { AppActions } from "../actions/AppActions"
import { CommonActions } from "../actions/CommonActions"
import { CommonUiActions } from "../actions/UiActions"

const mapStateToProps = (state: RootState) => {
  return { common: computeCommonState(state.common), commonUi: state.ui.common, app: state.app }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    commonActions: new CommonActions(dispatch),
    commonUiActions: new CommonUiActions(dispatch),
    appActions: new AppActions(dispatch)
  }
}

export type AppProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
