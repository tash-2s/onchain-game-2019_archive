import { asteriskKindNumToKind } from "../../../constants"
import { TradableAsteriskController } from "./TradableAsteriskController"
import { InGameAsteriskController } from "./InGameAsteriskController"
import { chains } from "../../chains"

type ExtractFromPromise<T> = T extends Promise<infer R> ? R : never

export const getUserInGameAsterisks = async (address: string) => {
  const r = await new InGameAsteriskController(chains.loom).getAsterisks(address)

  const userInGameAsterisks = r.ranks.map((_, i) => ({
    id: r.ids[i * 2],
    inGameAsteriskId: strToNum(r.ids[i * 2 + 1]),
    rank: strToNum(r.ranks[i]),
    rankupedAt: strToNum(r.times[i * 2]),
    createdAt: strToNum(r.times[i * 2 + 1]),
    axialCoordinateQ: strToNum(r.coordinates[i * 2]),
    axialCoordinateR: strToNum(r.coordinates[i * 2 + 1])
  }))

  return {
    user: { confirmedGold: r.confirmedGold, goldConfirmedAt: strToNum(r.goldConfirmedAt) },
    userInGameAsterisks
  }
}
export type ReturnTypeOfGetUserInGameAsterisks = ExtractFromPromise<
  ReturnType<typeof getUserInGameAsterisks>
>

export const getUserTradableAsterisks = async (address: string) => {
  const r = await new TradableAsteriskController(chains.loom).getAsterisks(address)

  const userTradableAsterisks = r.ids.map((_, i) => ({
    id: r.ids[i],
    kind: asteriskKindNumToKind(strToNum(r.kinds[i])),
    paramRate: strToNum(r.paramRates[i]),
    rankupedAt: strToNum(r.times[i * 2]),
    createdAt: strToNum(r.times[i * 2 + 1]),
    axialCoordinateQ: strToNum(r.coordinates[i * 2]),
    axialCoordinateR: strToNum(r.coordinates[i * 2 + 1]),
    artSeed: r.artSeeds[i]
  }))

  return {
    user: { confirmedGold: r.confirmedGold, goldConfirmedAt: strToNum(r.goldConfirmedAt) },
    userTradableAsterisks
  }
}
export type ReturnTypeOfGetUserTradableAsterisks = ExtractFromPromise<
  ReturnType<typeof getUserTradableAsterisks>
>

export const getTradableAsteriskTokensByIds = async (tokenIds: Array<string>) => {
  const fields: Array<TradableAsteriskToken> = []
  const batchSize = 100

  for (let i = 0; i < tokenIds.length; i += batchSize) {
    const ids = tokenIds.slice(i, i + batchSize)
    const fs = await _getTradableAsteriskTokensByIds(ids)
    fields.push(...fs)
  }

  return fields
}

const _getTradableAsteriskTokensByIds = async (tokenIds: Array<string>) => {
  const r = await new TradableAsteriskController(chains.loom).getAsteriskFieldsFromTokenIds(
    tokenIds
  )

  return tokenIds.map((id, i) => ({
    id: id,
    shortId: r.shortIds[i],
    version: strToNum(r.versions[i]),
    kind: asteriskKindNumToKind(strToNum(r.kinds[i])),
    paramRate: strToNum(r.paramRates[i]),
    artSeed: r.artSeeds[i]
  }))
}
export type TradableAsteriskToken = ExtractFromPromise<
  ReturnType<typeof _getTradableAsteriskTokensByIds>
>[number]

const strToNum = (str: string) => parseInt(str, 10)
