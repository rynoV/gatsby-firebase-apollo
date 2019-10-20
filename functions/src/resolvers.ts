import { AuthenticationError, ApolloError } from 'apollo-server-express'
import { auth } from 'firebase-admin'
import { IResolvers } from 'graphql-tools'
import { ChatAPI } from './datasources/chat'
import { UserAPI } from './datasources/user'
import { firestore } from './store'

const dev = process.env.FUNCTIONS_EMULATOR

interface IContext {
  dataSources: {
    userAPI: UserAPI
    chatAPI: ChatAPI
  }
  currentUser: auth.UserRecord | null
}

export const resolvers: IResolvers<any, IContext> = {
  Query: {
    async allUsers(
      _,
      { pageSize = 20, after }: { pageSize: number; after?: string },
      { dataSources }
    ) {
      const { users, pageToken } = await dataSources.userAPI.getAllUsers(
        pageSize,
        after
      )

      return {
        users,
        cursor: pageToken,
        hasMore: !!pageToken,
      }
    },
    async user(_, { idToken }, { dataSources }) {
      return dataSources.userAPI.getUser(idToken)
    },
  },
  Mutation: {
    async createChat(_, { uids }, { dataSources, currentUser }) {
      if (!currentUser && !dev) {
        throw new AuthenticationError(
          'You must be logged in to make this request.'
        )
      }

      const batch = firestore.batch()
      const chatDocPath = await dataSources.chatAPI.createChatInBatch(
        uids,
        batch
      )

      uids.forEach((uid: string) => {
        dataSources.userAPI.addChatToUser(uid, chatDocPath[0])
      })

      try {
        await batch.commit()
      } catch (e) {
        throw new ApolloError(e)
      }

      return chatDocPath
    },
  },
}
