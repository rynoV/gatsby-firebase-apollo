import React from 'react'
import { client } from './src/apollo/client'
import { ApolloProvider } from '@apollo/react-hooks'

export const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    'This application has been updated. ' +
    'Reload to display the latest version?',
  )

  if (answer === true) {
    window.location.reload()
  }
}

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)