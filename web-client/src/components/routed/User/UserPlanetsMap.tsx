import * as React from "react"
import styled from "styled-components"

import { UserNormalPlanet, ExtendedTargetUserState } from "../../../models/UserNormalPlanet"

export class UserPlanetsMap extends React.Component<{ user: ExtendedTargetUserState }> {
  render = () => {
    const o: { [key: string]: ExtendedTargetUserState["userNormalPlanets"][number] | null } = {}
    let biggestRadius = 0
    this.props.user.userNormalPlanets.forEach(up => {
      o[`${up.axialCoordinateQ}/${up.axialCoordinateR}`] = up

      if (biggestRadius < Math.abs(up.axialCoordinateQ)) {
        biggestRadius = Math.abs(up.axialCoordinateQ)
      }
      if (biggestRadius < Math.abs(up.axialCoordinateR)) {
        biggestRadius = Math.abs(up.axialCoordinateR)
      }
    })
    const usableRadius = (gold => {
      if (gold < 1) {
        return 1
      }
      let digit = 0
      let g = gold
      while (g !== 0) {
        g = Math.floor(g / 10)
        digit++
      }
      return digit
    })(this.props.user.gold.confirmed)
    const shownRadius = Math.max(biggestRadius, usableRadius)

    const hexes = mapHexesFromRadius(shownRadius).map(h => {
      const q = h[0]
      const r = h[1]
      const userPlanet = o[`${q}/${r}`]
      return (
        <Hex
          key={`${q}/${r}`}
          q={q}
          r={r}
          userPlanet={userPlanet}
          shiftTop={shownRadius * 86.6}
          shiftLeft={shownRadius * 75}
        />
      )
    })

    const height = (shownRadius * 2 + 1) * 86.6
    return <div style={{ position: "relative", height: height }}>{hexes}</div>
  }
}

const mapHexesFromRadius = (radius: number) => {
  const arr: Array<Array<number>> = []
  range(-radius, radius).forEach(q => {
    range(Math.max(-radius, -q - radius), Math.min(radius, -q + radius)).forEach(r => {
      arr.push([q, r])
    })
  })

  return arr
}

const range = (from: number, to: number) => {
  const arr: Array<number> = []
  for (let i = from; i <= to; i++) {
    arr.push(i)
  }
  return arr
}

class Hex extends React.Component<{
  q: number
  r: number
  userPlanet: UserNormalPlanet | null
  shiftTop: number
  shiftLeft: number
}> {
  render = () => {
    const x = 50 * ((3 / 2) * this.props.q)
    const y = 50 * ((Math.sqrt(3) / 2) * this.props.q + Math.sqrt(3) * this.props.r)
    return (
      <this.Styled style={{ left: x + this.props.shiftLeft, top: y + this.props.shiftTop }}>
        {this.props.userPlanet ? this.props.userPlanet.id : ""}
      </this.Styled>
    )
  }

  Styled = styled.div`
    clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
    background-color: red;
    width: 100px;
    height: calc(100px * 0.866);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
  `
}
