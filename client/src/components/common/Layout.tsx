import React, { useEffect, useState } from 'react'

import { FirebaseContext, getFirebase } from '/src/firebase'
import firebase from 'firebase/app'
import { SignIn } from '/src/components/common/SignIn'
import { globalWindow, idTokenLocalStorageKey } from '/src/vars'

export const Layout: React.FC = function({ children }) {
  const [currentFirebaseApp, setCurrentFirebaseApp] = useState<typeof firebase>()
  const [authenticated, setAuthenticated]           = useState<boolean>(false)

  useEffect(() => {
    const app      = import('firebase/app')
    const auth     = import('firebase/auth')
    const database = import('firebase/database')

    Promise.all([app, auth, database]).then(values => {
      const firebaseApp = getFirebase(values[0])
      setCurrentFirebaseApp(firebaseApp)

      firebaseApp.auth().onAuthStateChanged(async user => {
        if (!globalWindow) {
          return
        }

        if (!user) {
          globalWindow.localStorage.removeItem(idTokenLocalStorageKey)

          setAuthenticated(false)
        } else {
          globalWindow.localStorage.setItem(
            idTokenLocalStorageKey,
            await user.getIdToken(),
          )

          setAuthenticated(true)
        }
      })
    })
  }, [])

  if (!currentFirebaseApp) {
    return null
  }

  return (
    <FirebaseContext.Provider value={currentFirebaseApp}>
      {authenticated ? children : <SignIn />}
    </FirebaseContext.Provider>
  )
}