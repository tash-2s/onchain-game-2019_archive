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
  setPlanet: ((q: number, r: number) => () => void) | null
  select: () => void
}) {
  const x = props.hexSize * ((3 / 2) * props.q)
  const y = props.hexSize * ((Math.sqrt(3) / 2) * props.q + Math.sqrt(3) * props.r)
  const up = props.userPlanet

  const coverStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: "hsla(180deg, 100%, 50%, 50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer"
  }
  const cover = !!props.setPlanet ? <div style={coverStyle}>{up ? "replace" : "set"}</div> : <></>

  const hexStyle: React.CSSProperties = {
    left: x + props.shiftLeft,
    top: y + props.shiftTop,
    width: props.hexWidth,
    height: props.hexHeight,
    backgroundColor: "#000000",
    cursor: up ? "pointer" : "auto",
    clipPath: "polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
  }
  const onClick = props.setPlanet ? props.setPlanet(props.q, props.r) : props.select
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
    <div style={hexStyle} onClick={onClick}>
      {art}
      {cover}
    </div>
  )
}
