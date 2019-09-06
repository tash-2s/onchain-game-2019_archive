import * as React from "react"
import BN from "bn.js"

import { SpecialPlanetTokenFields } from "../models/SpecialPlanetTokenFields"
import { BNFormatter } from "../models/BNFormatter"
import { PlanetArt } from "./utils/PlanetArt"

export function SpecialPlanetTokenMetadataPage(props: { fieldsStr: string }) {
  const [tokenId, ...others] = props.fieldsStr.split(":")
  const fields = new SpecialPlanetTokenFields(others)
  const json = buildJSON(tokenId, fields)

  return (
    <div>
      <div id={"planet-token-id"}>{tokenId}</div>
      <div id={"planet-json"}>{json}</div>
      <div id={"planet-art"}>
        <PlanetArt kind={fields.kind} artSeed={fields.artSeed} canvasSize={500} />
      </div>
    </div>
  )
}

const buildJSON = (tokenId: string, fields: SpecialPlanetTokenFields) => {
  const obj = {
    name: `Fuga ${tokenId}`,
    description: "piyopiyo",
    image: "<IMAGE_URL>",
    short_id: parseInt(fields.shortId, 10),
    kind: fields.kind,
    parameter: BNFormatter.pretty(new BN(10).pow(new BN(fields.originalParamCommonLogarithm))).join(
      ""
    )
  }

  return JSON.stringify(obj)
}
