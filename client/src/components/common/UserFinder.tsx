import React, { Fragment, useRef, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { globalWindow } from '/src/vars'
import { gql } from 'apollo-boost'
import {
  AllUsers,
  AllUsers_allUsers_users,
  AllUsersVariables,
} from '/src/queryTypes'
import * as JsSearch from 'js-search'

const ALL_USERS = gql`
  query AllUsers($after: String, $pageSize: Int) {
    allUsers(after: $after, pageSize: $pageSize) {
      cursor
      hasMore
      users {
        email
        displayName
        uid
      }
    }
  }
`

const search = new JsSearch.Search('uid')
search.addIndex('email')
search.addIndex('displayName')

export const UserFinder: React.FC = function() {
  if (!globalWindow) {
    return null
  }

  const [searchResults, setSearchResults] = useState<
    AllUsers_allUsers_users[]
  >()
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { data, loading, error } = useQuery<AllUsers, AllUsersVariables>(
    ALL_USERS,
    {
      variables: {
        pageSize: 20,
      },
      onCompleted(queryData) {
        const users = queryData.allUsers && queryData.allUsers.users
        if (users) {
          users.forEach(user => {
            if (user) {
              search.addDocument(user)
            }
          })
        }
      },
    }
  )

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  function handleSearch() {
    if (searchInputRef.current) {
      setSearchResults(search.search(
        searchInputRef.current.value
      ) as AllUsers_allUsers_users[])
    }
  }

  const allUsers = data && data.allUsers && data.allUsers.users

  return (
    <Fragment>
      <h4>Find a user:</h4>
      <input type='search' ref={searchInputRef} />
      <input value='Search' type='submit' onClick={handleSearch} />
      <ul>
        {searchResults ? (
          getUserList(searchResults)
        ) : allUsers ? (
          getUserList(allUsers)
        ) : (
          <p>No results found</p>
        )}
      </ul>
    </Fragment>
  )
}

function getUserList(users: Array<AllUsers_allUsers_users | null>) {
  return users
    ? users.map(user => {
        if (!user || !user.email || !user.displayName) {
          return null
        }

        return (
          <li key={user.email}>
            {user.email}: {user.displayName}
          </li>
        )
      })
    : null
}
