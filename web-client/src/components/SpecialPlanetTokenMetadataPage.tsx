import * as React from "react"
import BN from "bn.js"

import { BNFormatter } from "../models/BNFormatter"
import { ChainContractMethods, SpecialPlanetTokenFields } from "../models/ChainContractMethods"
import { PlanetArt } from "./utils/PlanetArt"

export function SpecialPlanetTokenMetadataPage(props: { params: Array<string> }) {
  const tokenId = props.params[0]
  const [fields, setFields] = React.useState<null | SpecialPlanetTokenFields>(null)

  React.useEffect(() => {
    ChainContractMethods.getSpecialPlanetTokenFields(tokenId).then(f => {
      setFields(f)
    })
  }, [tokenId])

  if (fields) {
    const json = buildJSON(tokenId, fields)

    return (
      <div>
        <div id={"planet-json"}>{json}</div>
        <div id={"planet-art"}>
          <PlanetArt kind={fields.kind} artSeed={new BN(fields.artSeed)} canvasSize={500} />
        </div>
      </div>
    )
  } else {
    return <div>loading...</div>
  }
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
