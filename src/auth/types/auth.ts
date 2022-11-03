import {UserType} from './user';

export type SignOutCallbackType = () => Promise<void>;
export type SignInCallbackType = (email: string, password: string) => Promise<void>;
export type ChangePasswordCallbackType = (password: string) => Promise<void>;
export type ChangeAttributesCallbackType = (name: string, phone: string) => Promise<string>;
export type SaveAvatarCallbackType = (file: File) => Promise<void>;

export enum Challenge {
  pending,
  signIn,
  signedIn,
  setNewPassword,
  error,
}

// define auth type
export type AuthType = {
  user: UserType | null
  challenge: Challenge
  token?: string
  signOut?: SignOutCallbackType
  signIn?: SignInCallbackType
  completeNewPassword?: ChangePasswordCallbackType
  changeAttributes?: ChangeAttributesCallbackType
  saveAvatar?: SaveAvatarCallbackType
  loginUrl?: string
}
