import { Loom } from "./loom"

class Chain {
  constructor(readonly eth: number, readonly loom: Loom) {}
}

export const chain = new Chain(1, new Loom())
