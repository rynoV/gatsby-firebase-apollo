import React from 'react'
import { FirebaseProvider } from '/src/firebase/FirebaseProvider'
import { SignOut } from '/src/components/common/SignOut'
import { UserFinder } from '/src/components/common/UserFinder'
import { Layout } from '/src/components/common/Layout'

// export const query = graphql`
//     {
//         apollo {
//             launches {
//                 cursor
//                 launches {
//                     site
//                     mission {
//                         name
//                         missionPatch
//                     }
//                     rocket {
//                         name
//                         type
//                     }
//                     isBooked
//                 }
//             }
//         }
//     }
// `
//
export default function Index() {
  return (
    <Layout>
      <FirebaseProvider>
        <h1>Int Chat</h1>
        <UserFinder />
        <SignOut />
      </FirebaseProvider>
    </Layout>
  )
}
