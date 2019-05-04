import { LoomWeb3, getLoomContracts } from "./_loom.js"
export * from "./_loom.js"
import { Store } from "redux"
import { Time } from "../models/time"
import { CommonActions } from "../actions/CommonActions"

type TxCall<T> = import("web3x-es/contract").TxCall<T>
type TxSend<T> = import("web3x-es/contract").TxSend<T>

export const callLoomContractMethod = async <T>(
  f: (cs: ReturnType<typeof getLoomContracts>) => TxCall<T>
) => {
  console.time("call-loom")

  const r = await f(getLoomContracts()).call({ from: LoomWeb3.accountAddress })

  console.timeEnd("call-loom")
  console.log(r)

  return r
}

export const sendLoomContractMethod = async <T>(
  f: (cs: ReturnType<typeof getLoomContracts>) => TxSend<T>
) => {
  console.time("send-loom")

  const r = await f(getLoomContracts()).send({ from: LoomWeb3.accountAddress })

  console.timeEnd("send-loom")
  console.log(r)

  return r
}

export type TxCallGenericsType<T> = T extends TxCall<infer R> ? R : any

const updateLoomTimeDifference = async (store: Store) => {
  const loomTime = await LoomWeb3.getLoomTime()
  const webTime = Time.now()
  new CommonActions(store.dispatch).updateLoomTimeDifference(loomTime - webTime)
}

export const keepUpdatingLoomTime = (store: Store) => {
  updateLoomTimeDifference(store)
  setInterval(() => updateLoomTimeDifference(store), 15 * 1000)
}
