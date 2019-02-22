import * as React from "react"
import styled from "styled-components"

import { UserNormalPlanet, ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { UserActions } from "../../../actions/routed/UserActions"

// TODO: cleanup
export class UserPlanetsMap extends React.Component<{
  user: ExtendedTargetUserState
  isMine: boolean
  userActions: UserActions
}> {
  render = () => {
    const o: { [key: string]: ExtendedTargetUserState["userNormalPlanets"][number] | null } = {}
    let biggestRadius = 0
    this.props.user.userNormalPlanets.forEach(up => {
      o[`${up.axialCoordinateQ}/${up.axialCoordinateR}`] = up

      const distance = distanceFromCenter(up.axialCoordinateQ, up.axialCoordinateR)
      if (biggestRadius < distance) {
        biggestRadius = distance
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
      const settable =
        this.props.isMine &&
        !!this.props.user.normalPlanetIdToGet &&
        distanceFromCenter(q, r) <= usableRadius

      return (
        <Hex
          key={`${q}/${r}`}
          q={q}
          r={r}
          userPlanet={userPlanet}
          shiftTop={shownRadius * 86.6}
          shiftLeft={shownRadius * 75}
          planetSettable={settable}
          setPlanet={!!this.props.user.normalPlanetIdToGet ? this.setPlanet : null}
        />
      )
    })

    const height = (shownRadius * 2 + 1) * 86.6
    return <div style={{ position: "relative", height: height }}>{hexes}</div>
  }

  setPlanet = (q: number, r: number) => {
    return () => {
      if (!this.props.user.normalPlanetIdToGet) {
        throw new Error("this must be called with target")
      }

      this.props.userActions.getPlanet(this.props.user.normalPlanetIdToGet, q, r)
    }
  }
}

const distanceFromCenter = (q: number, r: number) => {
  const x = q
  const z = r
  const y = -x - z
  return Math.max(Math.abs(x), Math.abs(y), Math.abs(z))
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
  planetSettable: boolean
  setPlanet: ((q: number, r: number) => (() => void)) | null
}> {
  render = () => {
    const x = 50 * ((3 / 2) * this.props.q)
    const y = 50 * ((Math.sqrt(3) / 2) * this.props.q + Math.sqrt(3) * this.props.r)
    const buttonIfAvailable =
      this.props.planetSettable && !!this.props.setPlanet ? (
        <button onClick={this.props.setPlanet(this.props.q, this.props.r)}>set</button>
      ) : (
        <></>
      )

    const css = {
      left: x + this.props.shiftLeft,
      top: y + this.props.shiftTop,
      backgroundColor: this.props.userPlanet ? "cyan" : "red"
    }

    return (
      <this.Styled style={css}>
        <div>
          q:{this.props.q}, r:{this.props.r}
          <br />
          {this.props.userPlanet ? this.props.userPlanet.id : ""}
        </div>
        {buttonIfAvailable}
      </this.Styled>
    )
  }

  Styled = styled.div`
    clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
    width: 100px;
    height: calc(100px * 0.866);
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
  `
}
