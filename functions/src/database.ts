import admin, { ServiceAccount } from 'firebase-admin'
import { serviceAccount } from './firebase-admin-key'

export declare namespace Database {
  export interface IBaseDoc {
    id: string
    createdAt: admin.firestore.FieldValue
    updatedAt: admin.firestore.FieldValue

    [key: string]: any
  }

  export interface ITrip extends IBaseDoc {
    launchId: number
    userId: number
  }

  export interface IUser extends IBaseDoc {
    email: string
    token: string
  }

  export interface IFirestoreQuery {
    [key: string]: unknown
  }

  export type ReturnDoc<R> = R & IBaseDoc

  export interface IStore<R> {
    findOrCreate(query: Partial<R>): Promise<Array<ReturnDoc<R>> | null>

    destroy(query: Partial<R>): Promise<boolean>
  }

  export type collections = 'users' | 'trips'
}

type ReturnDocWithoutId<R extends Record<string, unknown>> =
  Partial<R>
  & Omit<Database.IBaseDoc, 'id'>

export class Store<R extends Record<string, unknown>>
  implements Database.IStore<R> {
  private readonly collection: admin.firestore.CollectionReference

  constructor(collectionId: Database.collections) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
      })
    }

    this.collection = admin.firestore().collection(collectionId)
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

  /**
   * First searches for documents matching the query and retrieves them. If
   * none are found they are created using the query object.
   * @param query Database.IFirestoreQuery
   * @return A promise resolving to an array containing the created or found
   *   document(s), or null if an error occurred.
   */
  public async findOrCreate(query: Partial<R>): Promise<Array<Database.ReturnDoc<R>> | null> {
    try {
      const { docs } = await this.getQuerySnapshot(query)

      if (docs[0]) {
        return await Promise.all(docs.map(async (doc: admin.firestore.QueryDocumentSnapshot) => {
          return await this.getDocDataWithId(doc.ref) as Database.ReturnDoc<R>
        }))
      } else {
        const newDocRef = await this.collection.add(
          this.createDocumentObject(query),
        )

        return [await this.getDocDataWithId(newDocRef)]
      }
    } catch (e) {
      console.log(e)

      return null
    }
  }

  private createDocumentObject(query: Partial<R>): ReturnDocWithoutId<Partial<R>> {
    const serverTimestamp                            = admin.firestore.FieldValue.serverTimestamp()
    const queryWithTimestamps: ReturnDocWithoutId<R> = {
      ...query,
      createdAt: serverTimestamp,
      updatedAt: serverTimestamp,
    }

    return Object.entries(queryWithTimestamps).reduce(
      (
        newDoc: ReturnDocWithoutId<Partial<R>>,
        queryPair,
      ) => {
        // @ts-ignore
        newDoc[queryPair[0]] = queryPair[1]
        return newDoc
      },
      {} as unknown as ReturnDocWithoutId<Partial<R>>,
    )
  }

  private async getDocDataWithId(docRef: admin.firestore.DocumentReference): Promise<Database.ReturnDoc<R>> {
    const { id }         = docRef
    const newDocSnapshot = await docRef.get()
    const newDoc         = ((await newDocSnapshot.data()) as unknown) as ReturnDocWithoutId<R>

    return {
      ...newDoc,
      id,
    } as unknown as Database.ReturnDoc<R>
  }

  private getQuerySnapshot(
    query: Partial<R>,
  ): Promise<admin.firestore.QuerySnapshot> {
    const builtFirestoreQuery: admin.firestore.Query = Object.entries(query)
      .reduce(
        (
          firestoreQuery: admin.firestore.Query,
          queryPair: [string, unknown],
        ) => {
          return firestoreQuery.where(
            queryPair[0],
            '==',
            queryPair[1],
          )
        },
        this.collection,
      )

    return builtFirestoreQuery.get()
  }
}
