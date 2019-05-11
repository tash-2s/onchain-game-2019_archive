import * as React from "react"
import BN from "bn.js"

import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { OngoingGoldCalculator } from "../../../models/OngoingGoldCalculator"
import { Time } from "../../../models/time"

export class OngoingGoldTimerComponent<
  P extends { user: ExtendedTargetUserState; loomTimeDifference: number }
> extends React.Component<P, { ongoingGold: BN }> {
  private timerId: NodeJS.Timeout | null = null
  protected timerInterval = 1000 // 1 sec

  constructor(props: P) {
    super(props)
    this.state = {
      ongoingGold: OngoingGoldCalculator.calculate(
        props.user.gold,
        props.user.goldPerSec,
        Time.nowFromDiff(props.loomTimeDifference)
      )
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
        this.props.user.goldPerSec,
        Time.nowFromDiff(this.props.loomTimeDifference)
      )
    })
  }
}
