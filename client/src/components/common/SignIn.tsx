import React, { useContext } from 'react'
import { StyledFirebaseAuth } from 'react-firebaseui'

import { FirebaseContext, getUiConfig } from '../../firebase'
import firebase from 'firebase/app'

export function SignIn() {
  const firebaseContextVal: typeof firebase | null = useContext(FirebaseContext)

  if (!firebaseContextVal) {
    return null
  }

  return (
    <StyledFirebaseAuth
      uiConfig={getUiConfig(firebaseContextVal)}
      firebaseAuth={firebase.auth()}
    />
  )
}
