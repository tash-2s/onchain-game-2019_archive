export interface UserState {
  targetUser: TargetUserState | null
}

export interface TargetUserState {
  id: string
  gold: number
}
