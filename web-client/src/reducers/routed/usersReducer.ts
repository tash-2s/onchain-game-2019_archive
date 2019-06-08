import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UsersActions } from "../../actions/routed/UsersActions"
import { UsersState } from "../../types/routed/usersTypes"
import BN from "bn.js"

const initialState: UsersState = {
  users: []
}

export const createUsersReducer = () =>
  reducerWithInitialState(initialState)
    .case(UsersActions.setUsers, (state, [address, response]) => {
      const addresses = response[0]
      const golds = response[1].map(g => new BN(g))
      const addrs = [address]

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
