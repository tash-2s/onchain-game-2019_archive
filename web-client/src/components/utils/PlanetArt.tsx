import * as React from "react"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { draw } from "../../misc/planetArt"

export function PlanetArt(props: {
  userPlanet: ComputedTargetUserState["userNormalPlanets"][number]
  size: number
}) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(
    () => {
      const canvas = canvasRef.current
      if (canvas && !!props.userPlanet) {
        const p = props.userPlanet.planet
        draw(canvas, props.size, p.kind, 0, 0, p.artSeed)
      }
    },
    props.userPlanet
      ? [props.userPlanet.planet.kind, 0, 0, props.userPlanet.planet.artSeedStr]
      : ["", 0, 0, ""]
  )

  return <canvas ref={canvasRef} />
}
