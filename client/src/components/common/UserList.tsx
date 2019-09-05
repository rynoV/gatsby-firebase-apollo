import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { globalWindow } from '/src/vars'
import { gql } from 'apollo-boost'
import { AllUsers, AllUsersVariables } from '/src/queryTypes'

const ALL_USERS = gql`
    query AllUsers($after: String, $pageSize: Int) {
        allUsers(after: $after, pageSize: $pageSize) {
            cursor
            hasMore
            users {
                email
                emailVerified
            }
        }
    }
`

export const UserList: React.FC = function() {
  if (!globalWindow) {
    return null
  }

  const { data, loading, error } = useQuery<AllUsers, AllUsersVariables>(
    ALL_USERS,
    {
      variables: {
        pageSize: 20,
      },
    },
  )

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <ul>
      {data && data.allUsers && data.allUsers.users
        ? data.allUsers.users.map(user => {
          if (!user || !user.email) {
            return null
          }
          return <li key={user.email}>{user.email}</li>
        })
        : null}
    </ul>
  )
}
