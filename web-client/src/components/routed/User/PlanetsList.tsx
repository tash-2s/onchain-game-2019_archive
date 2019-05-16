import * as React from "react"
import BN from "bn.js"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { NormalPlanetsData, initialPlanetIds } from "../../../data/planets"
import { OngoingGoldTimerComponent } from "./OngoingGoldTimerComponent"

export class PlanetsList extends OngoingGoldTimerComponent<{
  user: ComputedTargetUserState
  loomTimeDifference: number
  setPlanetToGet: (planetId: number) => void
}> {
  render = () => {
    const gold = this.state.ongoingGold
    const buttonText = "get"

    return NormalPlanetsData.map(p => {
      if (p.kind === "magic") {
        throw new Error("magic planets are not supported yet")
      }

      const price = new BN(10).pow(new BN(p.priceGoldCommonLogarithm))
      let button
      if (
        (this.props.user.userNormalPlanets.length === 0 &&
          gold.eqn(0) &&
          initialPlanetIds.includes(p.id)) ||
        gold.gte(price)
      ) {
        button = <button onClick={this.setPlanetToGet(p.id)}>{buttonText}</button>
      } else {
        button = <button disabled={true}>{buttonText}</button>
      }

      return (
        <div key={p.id}>
          id: {p.id}, kind: {p.kind}, param:{" "}
          {new BN(10).pow(new BN(p.paramCommonLogarithm)).toLocaleString()}, price:{" "}
          {price.toLocaleString()} gold
          {button}
        </div>
      )
    })
  }

  setPlanetToGet = (planetId: number) => {
    return () => {
      this.props.setPlanetToGet(planetId)
    }
  }
}
