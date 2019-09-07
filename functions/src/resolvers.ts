import { IResolvers } from 'graphql-tools'
import { AuthenticationError } from 'apollo-server-express'
import { UserAPI } from './datasources/user'
import { auth } from 'firebase-admin'
import { ChatAPI } from './datasources/chat'

interface IContext {
  dataSources: { userAPI: UserAPI, chatAPI: ChatAPI }
  currentUser: auth.UserRecord | null
}

export const resolvers: IResolvers<any, IContext> = {
  Query: {
    async allUsers(
      _,
      { pageSize = 20, after }: { pageSize: number; after?: string },
      { dataSources },
    ) {
      const { users, pageToken } = await dataSources.userAPI.getAllUsers(
        pageSize,
        after,
      )

      return {
        users,
        cursor : pageToken,
        hasMore: !!pageToken,
      }
    },
    async user(_, { idToken }, { dataSources }) {
      return dataSources.userAPI.getUser(idToken)
    },
  },
  Mutation: {
    createChat(_, { uids }, {dataSources, currentUser}) {
      if (!currentUser) {
        throw new AuthenticationError('You must be logged in to make this request.')
      }

      const chat = dataSources.chatAPI.createChat(uids)
    }
  }
}
