import BN from "bn.js"

const RADIUS_GOLD_THRESHOLD = [
  "100001", // to avoid radius up by initial asterisk
  "10000000",
  "10000000000",
  "100000000000000",
  "10000000000000000000",
  "10000000000000000000000000",
  "1000000000000000000000000000",
  "100000000000000000000000000000",
  "10000000000000000000000000000000",
  "1000000000000000000000000000000000",
  "100000000000000000000000000000000000",
  "10000000000000000000000000000000000000",
  "1000000000000000000000000000000000000000",
  "100000000000000000000000000000000000000000",
  "10000000000000000000000000000000000000000000",
  "1000000000000000000000000000000000000000000000"
].map(s => new BN(s))

export class UserAsteriskMapUtil {
  static distanceFromCenter = (q: number, r: number) => {
    const x = q
    const z = r
    const y = -x - z
    return Math.max(Math.abs(x), Math.abs(y), Math.abs(z))
  }

  static hexesFromMapRadius = (radius: number) => {
    const arr: Array<Array<number>> = []
    range(-radius, radius).forEach(q => {
      range(Math.max(-radius, -q - radius), Math.min(radius, -q + radius)).forEach(r => {
        arr.push([q, r])
      })
    })
    return arr
  }

  static hexesCountFromMapRadius = (radius: number) => {
    return 1 + 3 * radius * (radius + 1)
  }

  static coordinatesKey = (q: number, r: number) => `${q}/${r}`

  static mapRadiusFromGold = (gold: BN) => {
    for (let i = RADIUS_GOLD_THRESHOLD.length; i > 0; i--) {
      const bn = RADIUS_GOLD_THRESHOLD[i - 1]
      if (bn.lte(gold)) {
        return i + 1
      }
    }
    return 1
  }

  static requiredGoldFromMapRadius = (radius: number) => {
    if (radius <= 1) {
      return new BN(0)
    }
    const result = RADIUS_GOLD_THRESHOLD[radius - 2]
    if (result) {
      return result
    }
    return null
  }
}

const range = (from: number, to: number) => {
  if (from > to) {
    throw new Error("'to' must be bigger than 'from'")
  }
  const arr: Array<number> = []
  for (let i = from; i <= to; i++) {
    arr.push(i)
  }
  return arr
}
