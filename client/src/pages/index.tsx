import React from 'react'
import { FirebaseProvider } from '/src/firebase/FirebaseProvider'
import { SignOut } from '/src/components/common/SignOut'
import { UserList } from '/src/components/common/UserList'
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
        <div>Hello firebase</div>
        <UserList />
        <SignOut />
      </FirebaseProvider>
    </Layout>
  )
}
