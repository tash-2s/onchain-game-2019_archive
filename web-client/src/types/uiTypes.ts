const tuple = <T extends Array<string>>(...args: T) => args
export const sortKinds = tuple("Newest", "Oldest")
export type SortKind = (typeof sortKinds)[number]
