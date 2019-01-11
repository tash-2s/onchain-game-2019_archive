import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { State } from "../types/types"
import { App } from "../components/App"
import { AppActions } from "../actions/AppActions"

const mapStateToProps = (state: State) => {
  return { app: state.app }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return { actions: new AppActions(dispatch) }
}

export type AppProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
