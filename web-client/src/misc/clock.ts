import { Store } from "redux"

import { LoomWeb3 } from "./loom"
import { Time } from "./../models/time"
import { TimeActions } from "./../actions/TimeActions"

export const startClock = (store: Store) => {
  updateTime(store)

  let n = 0

  setInterval(() => {
    if (n >= 9) {
      n = 0
      updateTime(store)
    } else {
      n++
      new TimeActions(store.dispatch).updateWebTime(Time.now())
    }
  }, 1000)
}

const updateTime = async (store: Store) => {
  const loomTime = await LoomWeb3.getLoomTime()
  const webTime = Time.now()
  new TimeActions(store.dispatch).updateTime(webTime, loomTime)
}
