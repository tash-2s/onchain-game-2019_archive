import * as React from "react"
import { TargetUserState } from "../../../types/routed/userTypes"

export class OngoingUserStatus extends React.Component<
  Pick<TargetUserState, "gold" | "userNormalPlanets">,
  { ongoingGold: number }
> {
  state = { ongoingGold: 0 }

  private timerId: NodeJS.Timeout | null = null

  render = () => {
    return <p>ongoing gold: {this.state.ongoingGold}</p>
  }

  componentDidMount = () => {
    this.timerId = setInterval(() => this.updateOngoings(), 1000)
  }

  componentWillUnmount = () => {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }

  // TODO: impl
  updateOngoings = () => {
    const ongoing = 0
    this.setState({ ongoingGold: ongoing })
  }
}
