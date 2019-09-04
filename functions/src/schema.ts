import { gql } from 'apollo-server-express'

export const typeDefs = gql`
    type Query {
        allUsers(
            """
            The number of results to show. Must be >= 1. Default = 20
            """
            pageSize: Int
            """
            If you add a cursor here, it will only return results _after_ this cursor
            """
            after: String
        ): UserConnection
        user(idToken: ID!): User
    }

    type UserConnection {
        cursor: String
        hasMore: Boolean
        users: [User]
    }

    type User {
        uid: String!
        email: String
        emailVerified: Boolean!
        displayName: String
        phoneNumber: String
        photoURL: String
        disabled: Boolean!
        metadata: UserMetadata!
        providerData: [UserInfo]!
        passwordHash: String
        passwordSalt: String
        tokensValidAfterTime: String
    }

    type UserMetadata {
        lastSignInTime: String
        creationTime: String
    }

    type UserInfo {
        uid: String
        displayName: String
        email: String
        phoneNumber: String
        photoURL: String
        providerId: String
    }
`
