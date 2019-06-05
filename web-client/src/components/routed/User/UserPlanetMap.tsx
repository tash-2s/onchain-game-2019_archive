import * as React from "react"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { UserActions } from "../../../actions/routed/UserActions"
import { UserPageUiActions } from "../../../actions/UiActions"
import { UiState } from "../../../types/uiTypes"

import { PlanetHex } from "./PlanetHex"

interface Props {
  user: ComputedTargetUserState
  userPageUi: UiState["userPage"]
  isMine: boolean
  userActions: UserActions
  uiActions: UserPageUiActions
}

export class UserPlanetMap extends React.Component<Props> {
  render = () => {
    const shownRadius = this.props.user.map.shownRadius
    const hexSize = 50
    const hexWidth = hexSize * 2
    const hexHeight = Math.sqrt(3) * hexSize

    const hexes = this.props.user.map.hexes.map(h => {
      const settable =
        this.props.isMine && !!this.props.userPageUi.selectedNormalPlanetId && h.settable

      return (
        <PlanetHex
          key={`${h.q}/${h.r}`}
          q={h.q}
          r={h.r}
          userPlanet={h.userPlanet}
          shiftTop={shownRadius * hexHeight}
          shiftLeft={shownRadius * ((hexWidth / 4) * 3)}
          hexSize={hexSize}
          hexWidth={hexWidth}
          hexHeight={hexHeight}
          setPlanet={settable ? this.setPlanet : null}
        />
      )
    })

    const height = (shownRadius * 2 + 1) * hexHeight
    return <div style={{ position: "relative", height: height }}>{hexes}</div>
  }

  setPlanet = (q: number, r: number) => {
    return () => {
      if (!this.props.userPageUi.selectedNormalPlanetId) {
        throw new Error("this must be called with target")
      }
      this.props.userActions.getPlanet(this.props.userPageUi.selectedNormalPlanetId, q, r)
      this.props.uiActions.unselectPlanet()
    }
  }
}
