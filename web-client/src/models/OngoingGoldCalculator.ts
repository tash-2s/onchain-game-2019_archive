import { UserNormalPlanet } from "./UserNormalPlanet"

export class OngoingGoldCalculator {
  static calculate = (
    gold: { confirmed: number; confirmedAt: number },
    userNormalPlanets: Array<UserNormalPlanet>,
    now: number
  ): number => {
    if (gold.confirmedAt === 0) {
      return 0
    }

    const goldPerSec = (ups => {
      let totalResidenceParam = 0
      let totalGoldveinParam = 0
      ups.forEach(up => {
        switch (up.planetKind()) {
          case "residence":
            totalResidenceParam += up.paramMemo
            break
          case "goldvein":
            totalGoldveinParam += up.paramMemo
            break
        }
      })
      return totalResidenceParam * totalGoldveinParam
    })(userNormalPlanets)

    let diffSec = now - gold.confirmedAt
    if (diffSec < 0) {
      // this can occur because of the time difference between browser and loom
      diffSec = 0
    }

    return gold.confirmed + goldPerSec * diffSec
  }
}
