import BN from "bn.js"
import { reducerWithInitialState } from "typescript-fsa-reducers"

import { UsersActions } from "../actions/UsersActions"

const initialState: { users: Array<{ address: string; gold: string }> } = {
  users: []
}

export const createUsersReducer = () =>
  reducerWithInitialState(initialState)
    .case(UsersActions.setUsers, (state, payload) => {
      const addresses = payload[1].accounts
      const golds = payload[1].golds.map(g => new BN(g))
      const addrs = [payload[0]]

      const users = golds
        .map((gold, i) => ({ address: addresses[i], gold: gold }))
        .filter(o => o.gold.gtn(0))
        .filter(o => {
          if (addrs.includes(o.address)) {
            return false
          }
          addrs.push(o.address)
          return true
        })
        .map(o => ({ address: o.address, gold: o.gold.toString() }))

      return {
        ...state,
        users: users
      }
    })
    .build()
