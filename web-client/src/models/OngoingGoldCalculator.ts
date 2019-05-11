import { UserNormalPlanet } from "./UserNormalPlanet"
import BN from "bn.js"

export class OngoingGoldCalculator {
  static calculate = (
    gold: { confirmed: string; confirmedAt: number },
    goldPerSec: string,
    now: number
  ): BN => {
    if (gold.confirmedAt === 0) {
      return new BN(0)
    }

    let diffSec = now - gold.confirmedAt
    if (diffSec < 0) {
      // this can occur because of the time difference between browser and loom
      diffSec = 0
    }

    return new BN(gold.confirmed).add(new BN(goldPerSec).muln(diffSec))
  }
}
