import admin from 'firebase-admin'

export interface IUserConnection {
  cursor: string
  hasMore: boolean
  users: IUser[]
}

export interface ILaunch {
  id: string
  site?: string
  mission?: IMission
  rocket?: IRocket
  isBooked?: boolean
}

interface IRocket {
  id: string
  name?: string
  type?: string
}

export type IUser = admin.auth.UserRecord

interface IMission {
  name?: string

  missionPatch?(size: PatchSize): string
}

export enum PatchSize {
  SMALL,
  LARGE
}

