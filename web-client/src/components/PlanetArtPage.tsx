import * as React from "react"

import { SpecialPlanetTokenFields } from "../models/SpecialPlanetTokenFields"
import { PlanetArt } from "./utils/PlanetArt"

export function PlanetArtPage(props: { fieldsStr: string }) {
  const fields = new SpecialPlanetTokenFields(props.fieldsStr.split(":"))
  return (
    <div id={"planet-art"}>
      <PlanetArt kind={fields.kind} artSeed={fields.artSeed} canvasSize={500} />
    </div>
  )
}
