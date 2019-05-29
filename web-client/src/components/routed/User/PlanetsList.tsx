import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { PrettyBN } from "../../utils/PrettyBN"

export class PlanetsList extends React.Component<{
  normalPlanets: ComputedTargetUserState["normalPlanets"]
  setPlanetToGet: (planetId: number) => void
}> {
  render = () => {
    const buttonText = "get"

    return this.props.normalPlanets.map(p => {
      let button
      if (p.gettable) {
        button = <button onClick={this.setPlanetToGet(p.id)}>{buttonText}</button>
      } else {
        button = <button disabled={true}>{buttonText}</button>
      }

      return (
        <div key={p.id}>
          id: {p.id}, kind: {p.kind}, param: <PrettyBN bn={p.param} />, price:{" "}
          <PrettyBN bn={p.priceGold} /> gold
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
