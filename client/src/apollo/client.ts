import ApolloClient from 'apollo-boost'
import fetch from 'isomorphic-fetch'
import config from '../../config.js'
import { globalWindow, idTokenLocalStorageKey } from '/src/vars'

export const client = new ApolloClient({
  uri    : config.api,
  fetch,
  headers: {
    authorization: globalWindow &&
                   globalWindow.localStorage.getItem(idTokenLocalStorageKey),
  },
})