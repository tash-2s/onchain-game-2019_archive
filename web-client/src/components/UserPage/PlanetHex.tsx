import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { PlanetArt } from "../utils/PlanetArt"

export function PlanetHex(props: {
  q: number
  r: number
  userPlanet: ComputedTargetUserState["map"]["hexes"][number]["userPlanet"]
  shiftTop: number
  shiftLeft: number
  hexSize: number
  hexWidth: number
  hexHeight: number
  isSelectable: boolean
  isSelected: boolean
  select: () => void
}) {
  const x = props.hexSize * ((3 / 2) * props.q)
  const y = props.hexSize * ((Math.sqrt(3) / 2) * props.q + Math.sqrt(3) * props.r)
  const up = props.userPlanet

  const hexStyle: React.CSSProperties = {
    left: x + props.shiftLeft,
    top: y + props.shiftTop,
    width: props.hexWidth,
    height: props.hexHeight,
    backgroundColor: props.isSelected ? "yellow" : "#000000",
    clipPath: "polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
  }
  if (props.isSelectable || !!up) {
    hexStyle.cursor = "pointer"
  }
  const size = Math.min(props.hexWidth, props.hexHeight)
  const art = up ? (
    <PlanetArt
      kind={up.isNormal ? up.planet.kind : up.kind}
      artSeed={up.isNormal ? up.planet.artSeed : up.artSeed}
      canvasSize={size}
    />
  ) : (
    <></>
  )

  return (
    <div style={hexStyle} onClick={props.select}>
      {art}
    </div>
  )
}
