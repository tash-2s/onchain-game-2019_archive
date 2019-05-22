import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { UserActions } from "../../../actions/routed/UserActions"
import { UserPlanetsMapUtil } from "../../../models/UserPlanetsMapUtil"
import { UiState } from "../../../types/uiTypes"

import { PlanetHex } from "./PlanetHex"

interface Props {
  user: ComputedTargetUserState
  userPageUi: UiState["userPage"]
  isMine: boolean
  userActions: UserActions
}

export class UserPlanetsMap extends React.Component<Props> {
  render = () => {
    const {
      userPlanetsByCoordinates,
      userPlanetsBiggestRadius
    } = UserPlanetsMapUtil.userPlanetsAndThierBiggestRadius(this.props.user.userNormalPlanets)

    const usableRadius = this.props.user.mapRadius
    const shownRadius = Math.max(userPlanetsBiggestRadius, usableRadius)

    const hexes = UserPlanetsMapUtil.hexesFromMapRadius(shownRadius).map(h => {
      const q = h[0]
      const r = h[1]
      const key = UserPlanetsMapUtil.coordinatesKey(q, r)
      const userPlanet = userPlanetsByCoordinates[key]
      const settable =
        this.props.isMine &&
        !userPlanet &&
        !!this.props.userPageUi.selectedNormalPlanetId &&
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
      if (!this.props.userPageUi.selectedNormalPlanetId) {
        throw new Error("this must be called with target")
      }
      this.props.userActions.getPlanet(this.props.userPageUi.selectedNormalPlanetId, q, r)
    }
  }
}
