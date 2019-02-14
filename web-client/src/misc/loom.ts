import { LoomWeb3, getLoomContracts } from "./_loom.js"
export * from "./_loom.js"

type TxCall<T> = import("web3x-es/contract").TxCall<T>
type TxSend<T> = import("web3x-es/contract").TxSend<T>

export const callLoomContractMethod = <T>(
  f: (cs: ReturnType<typeof getLoomContracts>) => TxCall<T>
) => f(getLoomContracts()).call({ from: LoomWeb3.accountAddress })

export const sendLoomContractMethod = <T>(
  f: (cs: ReturnType<typeof getLoomContracts>) => TxSend<T>
) => f(getLoomContracts()).send({ from: LoomWeb3.accountAddress })

export type TxCallGenericsType<T> = T extends TxCall<infer R> ? R : any
