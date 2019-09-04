import { IResolvers } from 'graphql-tools'

export const resolvers: IResolvers = {
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
}
