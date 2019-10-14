import { getSpecialPlanetTokensByIds } from "./loom/organized"

type TypeOfTokensOfOwnerByIndex = (
  owner: string,
  index: string
) => Promise<{ tokenIds: Array<string>; nextIndex: string }>

export const getSpecialPlanetTokens = async (address: string, fn: TypeOfTokensOfOwnerByIndex) => {
  const ids = await getSpecialPlanetTokenIds(address, fn)
  const tokens = await getSpecialPlanetTokensByIds(ids)
  return tokens
}

const getSpecialPlanetTokenIds = async (address: string, fn: TypeOfTokensOfOwnerByIndex) => {
  const ids: Array<string> = []

  let index = "0"
  while (true) {
    const r = await fn(address, index)

    ids.push(...r.tokenIds)

    if (r.nextIndex === "0") {
      break
    }

    index = r.nextIndex
  }

  return ids
}
