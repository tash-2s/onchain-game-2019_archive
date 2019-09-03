import BN from "bn.js"

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

export class BNFormatter {
  static pretty = (bn: BN): [string, string] => {
    const separated = (
      bn
        .toString()
        .split("")
        .reverse()
        .join("")
        .match(/\d{1,3}/g) || ["0"]
    )
      .reverse()
      .map(s =>
        s
          .split("")
          .reverse()
          .join("")
      )

    const alphabetIndex = separated.length - 1
    if (alphabetIndex >= alphabet.length) {
      throw new Error("out of range")
    }
    const symbol = alphabet[alphabetIndex]

    let num: string
    if (separated.length === 1) {
      num = `${separated[0]}.000`
    } else {
      num = `${separated[0]}.${separated[1]}`
    }

    return [num, symbol]
  }
}
