import { ApolloError } from 'apollo-server-express'
import admin, { ServiceAccount } from 'firebase-admin'
import { serviceAccount } from './firebase-admin-key'

function getFirestore() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    })
  }
  return admin.firestore()
}

export const firestore = getFirestore()

export declare namespace Database {
  export interface IBaseDoc {
    id: string
    createdAt: admin.firestore.FieldValue
    updatedAt: admin.firestore.FieldValue

    [key: string]: any
  }

  export interface IChat extends IBaseDoc {
    uids: string[]
  }

  export interface IUser extends IBaseDoc {
    email: string
    token: string
  }

  export interface IFirestoreQuery {
    [key: string]: unknown
  }

  export interface ICreateOptions {
    docName: string
    batch: FirebaseFirestore.WriteBatch
    transaction: FirebaseFirestore.Transaction
  }

  export type collections = 'users' | 'chats'
}

type ReturnDocWithoutId<
  R extends Partial<Database.IChat | Database.IUser>
> = Partial<R> & Omit<Database.IBaseDoc, 'id'>

type OptionsWithTransOrBatch =
  | Omit<Database.ICreateOptions, 'transaction'>
  | Omit<Database.ICreateOptions, 'batch'>
  | Pick<Database.ICreateOptions, 'batch'>
  | Pick<Database.ICreateOptions, 'transaction'>

interface IUpdateDocVals {
  [key: string]: {
    value: unknown
    type?: 'array'
  }
}

export class Store<R extends Database.IChat | Database.IUser> {
  private readonly collection: admin.firestore.CollectionReference

  constructor(collectionId: Database.collections) {
    this.collection = firestore.collection(collectionId)
  }

  /**
   * Finds all documents matching the query and attempts to delete them.
   * @param query Database.IFirestoreQuery
   * @return a promise resolving to a boolean
   *   indicating whether the operation was a success or not.
   */
  public async destroy(query: Partial<R>): Promise<boolean> {
    try {
      const { docs } = await this.getQuerySnapshot(query)

      if (docs[0]) {
        for (const doc of docs) {
          await doc.ref.delete()
        }

        return true
      } else {
        return false
      }
    } catch (e) {
      console.log(e)

      return false
    }
  }

  public async findOrCreate(
    query: Partial<R>,
    options?: Pick<Database.ICreateOptions, 'docName'> | {}
  ): Promise<R[]>
  public async findOrCreate(
    query: Partial<R>,
    options: OptionsWithTransOrBatch
  ): Promise<string[]>
  public async findOrCreate(
    query: Partial<R>,
    options: Partial<Database.ICreateOptions> = {}
  ) {
    try {
      const { docs } = await this.getQuerySnapshot(query)

      if (docs[0]) {
        if (options.batch || options.transaction) {
          return docs.map(doc => doc.ref.path)
        } else {
          return await Promise.all(
            docs.map(async (doc: admin.firestore.QueryDocumentSnapshot) => {
              return (await this.getDocDataWithId(doc.ref)) as R
            })
          )
        }
      } else {
        return [await this.create(query, options)]
      }
    } catch (e) {
      throw new ApolloError(e)
      return e
    }
  }

  public async create(
    fields: Partial<R>,
    options?: Pick<Database.ICreateOptions, 'docName'> | {}
  ): Promise<R>
  public async create(
    fields: Partial<R>,
    options: OptionsWithTransOrBatch
  ): Promise<string>
  public async create(
    fields: Partial<R>,
    { docName, ...options }: Partial<Database.ICreateOptions> = {}
  ) {
    const docObject = this.createDocObject(fields)

    const docRef: FirebaseFirestore.DocumentReference = docName
      ? this.collection.doc(docName)
      : this.collection.doc()

    await this.docSet({ docRef, docObject }, options)

    // If this is part of a batch or a transaction the document won't be written
    // yet so we'll just return the path so that it can be used to grab the
    // document later after it has been written.
    if (options.batch || options.transaction) {
      return docRef.path
    } else {
      return this.getDocDataWithId(docRef)
    }
  }

  public async update(docPath: string, docVals: IUpdateDocVals) {
    const docRef = this.collection.doc(docPath)

    try {
      await docRef.update(this.getUpdateDocObject(docVals))
    } catch (e) {
      throw new ApolloError(e)
    }

    return true
  }

  private getUpdateDocObject(docVals: IUpdateDocVals) {
    return Object.entries(docVals).reduce(
      (
        acc: { [key: string]: unknown },
        entry: [
          string,
          {
            value: unknown
            type?: 'array' | undefined
          }
        ]
      ) => {
        const [key, value] = entry

        return {
          ...acc,
          [key]:
            value.type === 'array'
              ? admin.firestore.FieldValue.arrayUnion(value.value)
              : value.value,
        }
      },
      {}
    )
  }

  private async docSet(
    {
      docRef,
      docObject,
    }: {
      docRef: FirebaseFirestore.DocumentReference
      docObject: object
    },
    { batch, transaction }: Partial<Omit<Database.ICreateOptions, 'docName'>>
  ) {
    if (batch) {
      return batch.set(docRef, docObject)
    } else if (transaction) {
      return transaction.set(docRef, docObject)
    } else {
      return docRef.set(docRef, docObject)
    }
  }

  private createDocObject(fields: Partial<R>): ReturnDocWithoutId<Partial<R>> {
    const serverTimestamp = admin.firestore.FieldValue.serverTimestamp()

    return {
      ...fields,
      createdAt: serverTimestamp,
      updatedAt: serverTimestamp,
    }
  }

  private async getDocDataWithId(
    docRef: admin.firestore.DocumentReference
  ): Promise<R> {
    const { id } = docRef
    const newDocSnapshot = await docRef.get()
    const newDoc = ((await newDocSnapshot.data()) as unknown) as ReturnDocWithoutId<
      R
    >

    return ({
      ...newDoc,
      id,
    } as unknown) as R
  }

  private getQuerySnapshot(
    query: Partial<R>
  ): Promise<admin.firestore.QuerySnapshot> {
    const builtFirestoreQuery: admin.firestore.Query = Object.entries(
      query
    ).reduce(
      (firestoreQuery: admin.firestore.Query, queryPair: [string, unknown]) => {
        return firestoreQuery.where(queryPair[0], '==', queryPair[1])
      },
      this.collection
    )

    return builtFirestoreQuery.get()
  }
}
