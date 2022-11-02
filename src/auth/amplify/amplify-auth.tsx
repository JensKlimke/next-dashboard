import React, {useEffect, useState} from 'react';
import {getAvatar, saveAvatar} from './amplify-avatar';
import {HubCallback} from '@aws-amplify/core/lib/Hub';
import {Auth as AmplifyAuthenticator, Hub} from 'aws-amplify';
import {WithChildren} from 'types/withChildren';
import {UserType} from '../types/user';
import {Auth} from '../contexts/auth';
import {AuthType} from "auth/types/auth";
import {AMPLIFY_LOGIN_PATH} from "auth/config/consts";

const redirectPath= AMPLIFY_LOGIN_PATH;

/**
 * Logins in the user
 */
export const login = (email: string, password: string) =>
  AmplifyAuthenticator.signIn(email, password)
    .then(() => true);

/**
 * Logs out the current user
 */
export const logout = () =>
  AmplifyAuthenticator.signOut()
    .then(() => true)

/**
 * Converts the Amplify user to the internal user type
 * @param user Amplify user
 */
export async function convertUser(user: any) : Promise<UserType> {
  return {
    uid: user.attributes.sub,
    email: user.attributes.email,
    name: user.attributes.name,
    phone: user.attributes.phone_number,
    avatar: await getAvatar(user.attributes.picture)
  }
}


/**
 * AmplifyAuthProvider: Provides the user data to the underlying nodes
 * @param children The child elements (nodes)
 * @constructor
 */
export const AmplifyAuthProvider = ({ children }: WithChildren) => {
  // set states
  const [user, setUser] = useState<UserType | null>(null);
  const [pending, setPending] = useState(true);
  // listener to get data
  const authListener: HubCallback = ({ payload: { event, data } }) => {
    switch (event) {
      case 'signIn':
        convertUser(data)
          .then(u => setUser(u));
        break;
      case 'signOut':
        setUser(null);
        break;
      case 'tokenRefresh':
        // this is called, when user data is updated
        AmplifyAuthenticator.currentUserInfo().then((user: any ) => {
          convertUser(user)
            .then(u => setUser(u));
        })
        break;
    }
  }
  // on start-up load session data
  useEffect(() => {
    // set loading
    setPending(true);
    // check session
    AmplifyAuthenticator.currentSession()
      .then((session) => {
        if (session && session.isValid()) {
          return AmplifyAuthenticator.currentUserInfo()
            .then((user: any) => convertUser(user))
            .then(u => setUser(u))
        }
      })
      .catch(() => {}) // do nothing
      .then(() => setPending(false))
  }, []);
  // on start-up listen
  useEffect(() => {
    Hub.listen('auth', authListener)
    return () => Hub.remove('auth', authListener)
  }, []);
  // create auth object
  const authContextObject : AuthType = {
    user,
    pending,
    redirectPath,
    login,
    logout,
    saveAvatar,
  };
  // return auth provider
  return (
    <Auth.Provider value={authContextObject}>
      {children}
    </Auth.Provider>
  );
}

