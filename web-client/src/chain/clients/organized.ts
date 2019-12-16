import { getSpecialPlanetTokensByIds } from "./loom/organized"

interface Client {
  balanceOf: (owner: string) => Promise<string>
  tokensOfOwnerByIndex: (
    owner: string,
    startIndex: number,
    endIndex: number
  ) => Promise<Array<string>>
}

export const getSpecialPlanetTokens = async (address: string, client: Client) => {
  const ids = await getSpecialPlanetTokenIds(address, client)
  const tokens = await getSpecialPlanetTokensByIds(ids)
  return tokens
}

const getSpecialPlanetTokenIds = async (address: string, client: Client) => {
  const ids: Array<string> = []

  const balance = strToNum(await client.balanceOf(address))

  const batchSize = 100
  for (let i = 0; i < Math.ceil(balance / batchSize); i++) {
    const startIndex = i * batchSize
    const endIndex = startIndex + Math.min(balance, batchSize) - 1
    const tokenIds = await client.tokensOfOwnerByIndex(address, i * batchSize, endIndex)
    ids.push(...tokenIds)
  }

  return ids
}

const strToNum = (str: string) => parseInt(str, 10)
