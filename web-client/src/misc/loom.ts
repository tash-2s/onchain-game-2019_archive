import { LoomWeb3, getLoomContracts } from "./_loom.js"
export * from "./_loom.js"

interface TxCall<Return> {
  call(...args: any[]): Promise<Return>
}

export const callLoomContractMethod = <T>(
  f: (cs: ReturnType<typeof getLoomContracts>) => TxCall<T>
) => f(getLoomContracts()).call({ from: LoomWeb3.accountAddress })
