import * as React from "react"
import BN from "bn.js"

import { ComputedTargetUserState } from "../../computers/userComputer"
import { draw } from "../../misc/asteriskArt"
import { AsteriskKind } from "../../constants"

export function AsteriskArt(props: { kind: AsteriskKind; artSeed: BN; canvasSize: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      draw(canvas, props.canvasSize, props.kind, 0, 0, props.artSeed)
    }
  }, [props.canvasSize, props.kind, 0, 0, props.artSeed.toString()])

  return <canvas ref={canvasRef} />
}
