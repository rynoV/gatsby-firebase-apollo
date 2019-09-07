import admin, { ServiceAccount } from 'firebase-admin'
import { serviceAccount } from './firebase-admin-key'

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

  export interface IStore<R extends IChat | IUser> {
    findOrCreate(query: Partial<R>): Promise<R[] | null>

    destroy(query: Partial<R>): Promise<boolean>
  }

  export type collections = 'users' | 'chats'
}

type ReturnDocWithoutId<R extends Partial<Database.IChat | Database.IUser>> =
  Partial<R>
  & Omit<Database.IBaseDoc, 'id'>

export class Store<R extends Database.IChat | Database.IUser>
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
  public async findOrCreate(query: Partial<R>): Promise<R[] | null> {
    try {
      const { docs } = await this.getQuerySnapshot(query)

      if (docs[0]) {
        return await Promise.all(docs.map(async (doc: admin.firestore.QueryDocumentSnapshot) => {
          return await this.getDocDataWithId(doc.ref) as R
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

  public async create(fields: Partial<R>, docName?: string): Promise<R> {
    const documentObject = this.createDocumentObject(fields)
    let docRef: FirebaseFirestore.DocumentReference

    if (docName) {
      docRef = this.collection.doc(docName)

      await docRef.set(documentObject)
    } else {
      docRef = await this.collection.add(documentObject)
    }

    return this.getDocDataWithId(docRef)
  }

  private createDocumentObject(fields: Partial<R>): ReturnDocWithoutId<Partial<R>> {
    const serverTimestamp = admin.firestore.FieldValue.serverTimestamp()

    return {
      ...fields,
      createdAt: serverTimestamp,
      updatedAt: serverTimestamp,
    }
  }

  private async getDocDataWithId(docRef: admin.firestore.DocumentReference): Promise<R> {
    const { id }         = docRef
    const newDocSnapshot = await docRef.get()
    const newDoc         = ((await newDocSnapshot.data()) as unknown) as ReturnDocWithoutId<R>

    return {
      ...newDoc,
      id,
    } as unknown as R
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
