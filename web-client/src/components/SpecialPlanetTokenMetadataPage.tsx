import * as React from "react"
import BN from "bn.js"

import { BNFormatter } from "../models/BNFormatter"
import {
  getSpecialPlanetTokensByIds,
  SpecialPlanetToken
} from "../chain/clients/loom/organized"
import { PlanetArt } from "./utils/PlanetArt"

export function SpecialPlanetTokenMetadataPage(props: { params: Array<string> }) {
  const tokenId = props.params[0]
  const [token, setToken] = React.useState<null | SpecialPlanetToken>(
    null
  )

  React.useEffect(() => {
    getSpecialPlanetTokensByIds([tokenId]).then(tokens => {
      setToken(tokens[0])
    })
  }, [tokenId])

  if (token && tokenId === token.id) {
    const json = buildJSON(tokenId, token)

    return (
      <div>
        <div id={"planet-json"}>{json}</div>
        <div id={"planet-art"}>
          <PlanetArt kind={token.kind} artSeed={new BN(token.artSeed)} canvasSize={500} />
        </div>
      </div>
    )
  } else {
    return <div>loading...</div>
  }
}

const buildJSON = (tokenId: string, token: SpecialPlanetToken) => {
  const obj = {
    name: `Fuga #${token.shortId}`,
    description: `Full ID: ${tokenId}`,
    image: "<IMAGE_URL>",
    attributes: [
      { trait_type: "kind", value: token.kind },
      {
        trait_type: "parameter",
        value: token.paramRate
      }
    ],
    background_color: "000000"
  }

  return JSON.stringify(obj)
}
