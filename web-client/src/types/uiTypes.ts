export const sortKinds = ["Newest", "Oldest"] as const
export type SortKind = (typeof sortKinds)[number]
