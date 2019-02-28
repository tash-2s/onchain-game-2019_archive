import { reducerWithInitialState } from "typescript-fsa-reducers"
import { UsersActions } from "../../actions/routed/UsersActions"
import { UsersState } from "../../types/routed/usersTypes"

const initialState: UsersState = {
  users: []
}

export const createUsersReducer = () =>
  reducerWithInitialState(initialState)
    .case(UsersActions.setUsers, (state, response) => {
      const addresses = response[0]
      const golds = response[1].map(g => parseInt(g, 10))
      const addrs: Array<string> = []

      const users: UsersState["users"] = golds
        .map((gold, i) => ({ address: addresses[i], gold: gold }))
        .filter(o => o.gold > 0)
        .filter(o => {
          if (addrs.includes(o.address)) {
            return false
          }
          addrs.push(o.address)
          return true
        })

      return {
        ...state,
        users: users
      }
    })
    .build()
