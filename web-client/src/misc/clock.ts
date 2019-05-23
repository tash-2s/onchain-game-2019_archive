import { Store } from "redux"

import { LoomWeb3 } from "./loom"
import { Time } from "./../models/time"
import { CommonActions } from "./../actions/CommonActions"

export const startClock = (store: Store) => {
  updateTime(store)

  let n = 0

  setInterval(() => {
    if (n >= 9) {
      n = 0
      updateTime(store)
    } else {
      n++
      new CommonActions(store.dispatch).updateWebTime(Time.now())
    }
  }, 1000)
}

const updateTime = async (store: Store) => {
  const loomTime = await LoomWeb3.getLoomTime()
  const webTime = Time.now()
  new CommonActions(store.dispatch).updateTime(webTime, loomTime)
}
