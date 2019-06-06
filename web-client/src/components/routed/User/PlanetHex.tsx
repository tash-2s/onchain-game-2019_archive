import * as React from "react"

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
  select: () => void
}) {
  const x = props.hexSize * ((3 / 2) * props.q)
  const y = props.hexSize * ((Math.sqrt(3) / 2) * props.q + Math.sqrt(3) * props.r)

  const buttonIfAvailable = !!props.setPlanet ? (
    <button className={"button is-small"} onClick={props.setPlanet(props.q, props.r)}>
      {props.userPlanet ? "replace" : "set"}
    </button>
  ) : (
    <></>
  )

  const css: React.CSSProperties = {
    left: x + props.shiftLeft,
    top: y + props.shiftTop,
    width: props.hexWidth,
    height: props.hexHeight,
    backgroundColor: props.userPlanet ? "cyan" : "red",
    cursor: props.userPlanet ? "pointer" : "auto",
    clipPath: "polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
  }

  return (
    <div style={css} onClick={props.select}>
      {buttonIfAvailable}
    </div>
  )
}
