import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { IUser } from '../@types'
import admin, { ServiceAccount } from 'firebase-admin'
import { serviceAccount } from '../firebase-admin-key'

interface IContextProps {
  user?: {
    email?: string
    id?: number
  }
}

export class UserAPI extends DataSource {
  // @ts-ignore
  private context: IContextProps | undefined
  private auth: admin.auth.Auth

  constructor() {
    super()

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
      })
    }

    this.auth = admin.auth()
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  public initialize(config: DataSourceConfig<IContextProps>) {
    this.context = config.context
  }

  public async getUser(idToken: string): Promise<IUser | void> {
    const { uid } = await this.auth.verifyIdToken(idToken)
    return this.auth.getUser(uid)
  }

  public async getAllUsers(
    pageSize: number,
    after?: string,
  ): Promise<admin.auth.ListUsersResult> {
    return this.auth.listUsers(pageSize, after)
  }
}
