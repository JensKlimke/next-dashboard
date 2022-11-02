import {UserType} from './user';

export type AuthType = {
  user: UserType | null
  pending: boolean
  redirectPath?: string
  login?: (email: string, password: string) => Promise<boolean>
  logout?: () => void
  saveAvatar?: (file: File) => Promise<void>
  updateAccessToken?: (token: string) => void
}
