import * as React from "react"

import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { OngoingGoldCalculator } from "../../../models/OngoingGoldCalculator"

export class OngoingGoldTimerComponent<
  P extends { user: ExtendedTargetUserState }
> extends React.Component<P, { ongoingGold: number }> {
  state = { ongoingGold: 0 }

  private timerId: NodeJS.Timeout | null = null

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
      ongoingGold: OngoingGoldCalculator.calculate(
        this.props.user.gold,
        this.props.user.userNormalPlanets
      )
    })
  }
}
