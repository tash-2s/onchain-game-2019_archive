import * as React from "react"

import { UserPageProps } from "../containers/UserPageContainer"
import { TargetUser } from "./UserPage/TargetUser"
import { Tokens } from "./UserPage/Tokens"
import { initialUserPageUIState } from "../reducers/userPageUIReducer"

export function UserPage(props: UserPageProps) {
  React.useEffect(() => {
    props.userActions.main.setTargetUser(props.route.params[0])
    return () => {
      props.userActions.main.clearTargetUser()
      props.userPageUIActions.clear()
    }
  }, [props.route.params[0]])

  if (!props.user.targetUser || props.user.targetUser.address !== props.route.params[0]) {
    return <div>loading...</div>
  }

  switch (props.userPageUI.selectedPageViewKind) {
    case "main":
      return (
        <TargetUser
          currentUser={props.currentUser}
          time={props.time}
          userPageUI={props.userPageUI}
          targetUser={props.user.targetUser}
          userPageUIActions={props.userPageUIActions}
          userActions={props.userActions}
        />
      )
    case "tokens":
      return (
        <Tokens
          user={props.user.targetUser}
          userActionsForTradableAsterisk={props.userActions.tradable}
          userPageUIActions={props.userPageUIActions}
        />
      )
    default:
      throw new Error("undefined view kind")
  }
}
