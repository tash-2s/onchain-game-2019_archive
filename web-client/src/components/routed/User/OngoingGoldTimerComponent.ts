import * as React from "react"

import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { OngoingGoldCalculator } from "../../../models/OngoingGoldCalculator"

export class OngoingGoldTimerComponent<
  P extends { user: ExtendedTargetUserState }
> extends React.Component<P, { ongoingGold: number }> {
  private timerId: NodeJS.Timeout | null = null
  protected timerInterval = 1000 // 1 sec

  constructor(props: P) {
    super(props)
    this.state = {
      ongoingGold: OngoingGoldCalculator.calculate(props.user.gold, props.user.userNormalPlanets)
    }
  }

  componentDidMount = () => {
    this.timerId = setInterval(() => this.updateOngoings(), this.timerInterval)
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
