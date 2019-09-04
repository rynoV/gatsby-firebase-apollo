import { ApolloServer } from 'apollo-server-express'

import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { UserAPI } from './datasources/user'
import { Request } from 'express'

const dev = process.env.FUNCTIONS_EMULATOR

export const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context      : async ({ req }: { req: Request }) => {
    const idToken = (req.headers && req.headers.authorization) || ''

    if (!idToken) {
      return { currentUser: null }
    }

    const currentUser = await new UserAPI().getUser(idToken)

    if (!currentUser) {
      return { currentUser: null }
    }

    return { currentUser }
  },
  dataSources() {
    return {
      userAPI: new UserAPI(),
    }
  },
  introspection: !!dev,
  playground   : !!dev,
})
