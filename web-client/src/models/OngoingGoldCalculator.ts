import BN from "bn.js"

export class OngoingGoldCalculator {
  static calculate = (
    goldConfirmed: BN,
    goldConfirmedAt: number,
    goldPerSec: BN,
    now: number
  ): BN => {
    if (goldConfirmedAt === 0) {
      return new BN(0)
    }

    let diffSec = now - goldConfirmedAt
    if (diffSec < 0) {
      // this can occur because of the time difference between browser and loom
      diffSec = 0
    }

    return goldConfirmed.add(goldPerSec.muln(diffSec))
  }
}
