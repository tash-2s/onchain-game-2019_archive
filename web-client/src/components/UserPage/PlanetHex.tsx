import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { draw } from "../../misc/planetArt"

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

  const cover = !!props.setPlanet ? (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        backgroundColor: "hsla(180deg, 100%, 50%, 50%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      onClick={props.setPlanet(props.q, props.r)}
    >
      {props.userPlanet ? "replace" : "set"}
    </div>
  ) : (
    <></>
  )

  const css: React.CSSProperties = {
    left: x + props.shiftLeft,
    top: y + props.shiftTop,
    width: props.hexWidth,
    height: props.hexHeight,
    backgroundColor: "grey",
    cursor: props.userPlanet ? "pointer" : "auto",
    clipPath: "polygon(75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%, 25% 0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute"
  }

  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(() => {
    const canvas = canvasRef.current
    const up = props.userPlanet
    if (canvas && !!up) {
      const p = up.planet
      draw(canvas, p.kind, 0, 0, p.artSeed)
    }
  })

  return (
    <div style={css} onClick={props.select}>
      {props.userPlanet ? <canvas ref={canvasRef} /> : ""}
      {cover}
    </div>
  )
}
