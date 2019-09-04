import React from 'react'
import { client } from './src/apollo/client'
import { ApolloProvider } from '@apollo/react-hooks'

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>{element}</ApolloProvider>
)