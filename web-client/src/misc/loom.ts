import { LoomWeb3, getLoomContracts } from "./_loom.js"
export * from "./_loom.js"

type TxCall<T> = import("web3x-es/contract").TxCall<T>
type TxSend<T> = import("web3x-es/contract").TxSend<T>

export const callLoomContractMethod = async <T>(
  f: (cs: ReturnType<typeof getLoomContracts>) => TxCall<T>
) => {
  const r = await f(getLoomContracts()).call({ from: LoomWeb3.accountAddress })
  console.log(r)
  return r
}

export const sendLoomContractMethod = async <T>(
  f: (cs: ReturnType<typeof getLoomContracts>) => TxSend<T>
) => {
  const r = await f(getLoomContracts()).send({ from: LoomWeb3.accountAddress })
  console.log(r)
  return r
}

export type TxCallGenericsType<T> = T extends TxCall<infer R> ? R : any
