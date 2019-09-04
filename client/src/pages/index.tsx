import React from 'react'
import { Layout } from '/src/components/common/Layout'
import { SignOut } from '/src/components/common/SignOut'
import { UserList } from '/src/components/common/UserList'

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

export default function Index() {
  return (
    <Layout>
      <div>Hello firebase</div>
      <UserList />
      <SignOut />
    </Layout>
  )
}
