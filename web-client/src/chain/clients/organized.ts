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

  let balance = strToNum(await client.balanceOf(address))

  let startIndex = 0
  while (balance > 0) {
    const endIndex = startIndex + Math.min(balance, 100)
    const tokenIds = await client.tokensOfOwnerByIndex(address, startIndex, endIndex)
    ids.push(...tokenIds)
    balance -= endIndex - startIndex
    startIndex += 100
  }

  return ids
}

const strToNum = (str: string) => parseInt(str, 10)
