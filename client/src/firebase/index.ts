import React from 'react'
import firebaseType from 'firebase/app'

const config = {
  apiKey           : 'AIzaSyAuYRojN1dJeJWKwG7LEfMepB7DLH9jj3c',
  authDomain       : 'fir-learn-f283b.firebaseapp.com',
  databaseURL      : 'https://fir-learn-f283b.firebaseio.com',
  projectId        : 'fir-learn-f283b',
  storageBucket    : '',
  messagingSenderId: '685582142278',
  appId            : '1:685582142278:web:da516a0ac57a7ea2',
}

let firebaseCache: typeof firebaseType | undefined

export function getUiConfig(firebase: typeof firebaseType): firebaseui.auth.Config {
  return {
    signInFlow   : 'popup',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
  }
}

export const getFirebase = (firebase: typeof firebaseType) => {
  if (firebaseCache) {
    return firebaseCache
  }

  firebase.initializeApp(config)
  firebaseCache = firebase
  return firebase
}

export const FirebaseContext = React.createContext<typeof firebaseType | null>(
  null,
)
