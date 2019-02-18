import * as React from "react"

import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { OngoingGoldCalculator } from "../../../models/OngoingGoldCalculator"

export class OngoingUserStatus extends React.Component<
  Pick<ExtendedTargetUserState, "gold" | "userNormalPlanets">,
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

  updateOngoings = () => {
    this.setState({
      ongoingGold: OngoingGoldCalculator.calculate(this.props.gold, this.props.userNormalPlanets)
    })
  }
}
