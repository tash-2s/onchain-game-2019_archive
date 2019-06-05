import * as React from "react"
import styled from "styled-components"

import { ComputedTargetUserState } from "../../../computers/userComputer"

export function PlanetHex(props: {
  q: number
  r: number
  userPlanet: ComputedTargetUserState["userNormalPlanets"][number] | null
  shiftTop: number
  shiftLeft: number
  hexSize: number
  hexWidth: number
  hexHeight: number
  setPlanet: ((q: number, r: number) => (() => void)) | null
}) {
  const x = props.hexSize * ((3 / 2) * props.q)
  const y = props.hexSize * ((Math.sqrt(3) / 2) * props.q + Math.sqrt(3) * props.r)

  const buttonIfAvailable = !!props.setPlanet ? (
    <button onClick={props.setPlanet(props.q, props.r)}>
      {props.userPlanet ? "replace" : "set"}
    </button>
  ) : (
    <></>
  )

  const css = {
    left: x + props.shiftLeft,
    top: y + props.shiftTop,
    width: props.hexWidth,
    height: props.hexHeight,
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
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`
