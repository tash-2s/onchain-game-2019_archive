import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../types/rootTypes"
import { App } from "../components/App"
import { AppActions } from "../actions/AppActions"
import { CommonActions } from "../actions/CommonActions"

const mapStateToProps = (state: RootState) => {
  return { common: state.common, app: state.app }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    commonActions: new CommonActions(dispatch),
    appActions: new AppActions(dispatch)
  }
}

export type AppProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
