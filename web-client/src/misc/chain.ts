import { Eth } from "./eth"
import { Loom } from "./loom"

class Chain {
  constructor(readonly eth: Eth, readonly loom: Loom) {}
}

export const chain = new Chain(new Eth(), new Loom())
