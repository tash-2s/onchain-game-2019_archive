import { connect } from "react-redux"
import { Dispatch, AnyAction } from "redux"

import { RootState } from "../../types/rootTypes"
import { CommonState } from "../../types/commonTypes"

import { UserNormalPlanet, ExtendedUserState } from "../../models/UserNormalPlanet"
import { User } from "../../components/routed/User"
import { UserActions } from "../../actions/routed/UserActions"
import { CommonActions } from "../../actions/CommonActions"

const mapStateToProps = (state: RootState): { common: CommonState; user: ExtendedUserState } => {
  if (!state.routed.user.targetUser) {
    return {
      common: state.common,
      user: { ...state.routed.user, targetUser: null }
    }
  }

  return {
    common: state.common,
    user: {
      ...state.routed.user,
      targetUser: {
        ...state.routed.user.targetUser,
        userNormalPlanets: state.routed.user.targetUser.userNormalPlanets.map(
          up => new UserNormalPlanet(up)
        )
      }
    }
  }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  return {
    commonActions: new CommonActions(dispatch),
    userActions: new UserActions(dispatch)
  }
}

export type UserDispatchProps = ReturnType<typeof mapDispatchToProps>
export type UserProps = ReturnType<typeof mapStateToProps> & UserDispatchProps

export const UserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(User)
