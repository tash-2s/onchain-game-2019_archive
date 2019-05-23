import * as React from "react"
import styled from "styled-components"

import { ComputedTargetUserState } from "../../../computers/userComputer"
import { UserPlanetsMapUtil } from "../../../models/UserPlanetsMapUtil"

export function PlanetHex(props: {
  q: number
  r: number
  userPlanet: ComputedTargetUserState["userNormalPlanets"][number] | null
  shiftTop: number
  shiftLeft: number
  setPlanet: ((q: number, r: number) => (() => void)) | null
}) {
  const x = UserPlanetsMapUtil.hexSize * ((3 / 2) * props.q)
  const y = UserPlanetsMapUtil.hexSize * ((Math.sqrt(3) / 2) * props.q + Math.sqrt(3) * props.r)

  const buttonIfAvailable = !!props.setPlanet ? (
    <button onClick={props.setPlanet(props.q, props.r)}>set</button>
  ) : (
    <></>
  )

  const css = {
    left: x + props.shiftLeft,
    top: y + props.shiftTop,
    backgroundColor: props.userPlanet ? "cyan" : "red"
  }

  return (
    <Styled style={css}>
      <div>
        q:{props.q}, r:{props.r}
        <br />
        {props.userPlanet ? props.userPlanet.id : ""}
      </div>
      {buttonIfAvailable}
    </Styled>
  )
}

const Styled = styled.div`
  clip-path: polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0);
  width: ${UserPlanetsMapUtil.hexWidth}px;
  height: ${UserPlanetsMapUtil.hexHeight}px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`
