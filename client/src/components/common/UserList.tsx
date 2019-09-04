import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { globalWindow } from '/src/vars'
import { gql } from 'apollo-boost'

const ALL_USERS = gql`
    query AllUsers($after: String, $pageSize: Int) {
        allUsers(after: $after, pageSize: $pageSize) {
            cursor
            hasMore
            users {
                email
            }
        }
    }
`

export function UserList() {
  if (!globalWindow) {
    return null
  }

  const response = useQuery(ALL_USERS, {
    variables: {
      pageSize: 20,
    },
  })
  console.log(response)

  return <div>User list</div>
}
