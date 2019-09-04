import React, { useContext } from 'react'

import { FirebaseContext } from '../../firebase'
import firebase from 'firebase/app'

export function SignOut() {
  const firebaseContextVal: typeof firebase | null = useContext(FirebaseContext)

  function signOut() {
    if (firebaseContextVal) {
      firebaseContextVal.auth().signOut()
    }
  }

  return (
    <button
      style={{
        marginLeft     : 10,
        borderRadius   : '0.5rem',
        backgroundColor: '#fff',
        border         : '2px solid #ffa400',
        fontFamily     : 'sans-serif',
        padding        : '0.5rem 0.5rem',
        color          : '#0f0f0f',
      }}
      onClick={signOut}
    >
      Sign Out
    </button>
  )
}
