import { DataSource, DataSourceConfig } from 'apollo-datasource'
import { Database, Store } from '../store'

interface IContextProps {
  user?: {
    email?: string
    id?: number
  }
}

export class ChatAPI extends DataSource {
  // @ts-ignore
  private context: IContextProps | undefined
  private store: Store<Database.IChat>

  constructor() {
    super()

    this.store = new Store<Database.IChat>('chats')
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

  public async createChat(
    uids: string[]
  ): Promise<Array<Database.IChat | null>> {
    return this.store.findOrCreate({ uids })
  }

  public async createChatInBatch(
    uids: string[],
    batch: FirebaseFirestore.WriteBatch
  ): Promise<string[]> {
    return this.store.findOrCreate({ uids }, { batch })
  }

  public async createChatInTransaction(
    uids: string[],
    transaction: FirebaseFirestore.Transaction
  ): Promise<string[]> {
    return this.store.findOrCreate({ uids }, { transaction })
  }
}
