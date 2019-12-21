import * as React from "react"
import BN from "bn.js"

import { BNFormatter } from "../models/BNFormatter"
import {
  getTradableAsteriskTokensByIds,
  TradableAsteriskToken
} from "../chain/clients/loom/organized"
import { AsteriskArt } from "./utils/AsteriskArt"

export function TradableAsteriskTokenMetadataPage(props: { params: Array<string> }) {
  const tokenId = props.params[0]
  const [token, setToken] = React.useState<null | TradableAsteriskToken>(null)

  React.useEffect(() => {
    getTradableAsteriskTokensByIds([tokenId]).then(tokens => {
      setToken(tokens[0])
    })
  }, [tokenId])

  if (token && tokenId === token.id) {
    const json = buildJSON(tokenId, token)

    return (
      <div>
        <div id={"asterisk-json"}>{json}</div>
        <div id={"asterisk-art"}>
          <AsteriskArt kind={token.kind} artSeed={new BN(token.artSeed)} canvasSize={500} />
        </div>
      </div>
    )
  } else {
    return <div>loading...</div>
  }
}

const buildJSON = (tokenId: string, token: TradableAsteriskToken) => {
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
