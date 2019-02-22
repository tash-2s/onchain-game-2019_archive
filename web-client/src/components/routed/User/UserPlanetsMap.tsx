import * as React from "react"

import { ExtendedTargetUserState } from "../../../models/UserNormalPlanet"
import { UserActions } from "../../../actions/routed/UserActions"
import { UserPlanetsMapUtil } from "../../../models/UserPlanetsMapUtil"

import { PlanetHex } from "./PlanetHex"

export class UserPlanetsMap extends React.Component<{
  user: ExtendedTargetUserState
  isMine: boolean
  userActions: UserActions
}> {
  render = () => {
    const {
      userPlanetsByCoordinates,
      userPlanetsBiggestRadius
    } = UserPlanetsMapUtil.userPlanetsAndThierBiggestRadius(this.props.user.userNormalPlanets)

    const usableRadius = UserPlanetsMapUtil.mapRadiusFromGold(this.props.user.gold.confirmed)
    const shownRadius = Math.max(userPlanetsBiggestRadius, usableRadius)

    const hexes = UserPlanetsMapUtil.hexesFromMapRadius(shownRadius).map(h => {
      const q = h[0]
      const r = h[1]
      const key = UserPlanetsMapUtil.coordinatesKey(q, r)
      const userPlanet = userPlanetsByCoordinates[key]
      const settable =
        this.props.isMine &&
        !!this.props.user.normalPlanetIdToGet &&
        UserPlanetsMapUtil.distanceFromCenter(q, r) <= usableRadius

      return (
        <PlanetHex
          key={key}
          q={q}
          r={r}
          userPlanet={userPlanet}
          shiftTop={shownRadius * UserPlanetsMapUtil.hexHeight}
          shiftLeft={shownRadius * ((UserPlanetsMapUtil.hexWidth / 4) * 3)}
          setPlanet={settable ? this.setPlanet : null}
        />
      )
    })

    const height = (shownRadius * 2 + 1) * UserPlanetsMapUtil.hexHeight
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
