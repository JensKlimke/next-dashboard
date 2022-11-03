import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {getAvatar, saveAmplifyAvatar} from './amplify-avatar';
import {Auth as AmplifyAuthenticator, Hub} from 'aws-amplify';
import {WithChildren} from 'types/withChildren';
import {UserType} from '../types/user';
import {Auth} from '../contexts/auth';
import {
  Challenge,
  ChangeAttributesCallbackType,
  ChangePasswordCallbackType, SaveAvatarCallbackType,
  SignInCallbackType,
  SignOutCallbackType
} from "auth/types/auth";
import {AMPLIFY_LOGIN_PATH} from "auth/config/consts";

// define login url
const loginUrl = AMPLIFY_LOGIN_PATH;

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
  const [challengeUser, setChallengeUser] = useState<any>();
  const [token, setToken] = useState<string>();
  // callbacks
  const evaluateUser = useCallback(() => {
    AmplifyAuthenticator.currentUserInfo()
      .then((amplifyUser: any) => convertUser(amplifyUser))
      .then(u => setUser(u))
      .catch(e => console.error('evaluate user', e))
      .then(() => setPending(false))
  }, []);
  // auth listener
  const authListener = useCallback(({payload} : any) => {
    if (payload.event === 'signIn') evaluateUser();
    else if (payload.event === 'tokenRefresh') evaluateUser();
    else if (payload.event === 'signOut') setUser(null);
  }, []);
  // sign-in callback
  const signIn = useCallback<SignInCallbackType>((email, password) => {
    return AmplifyAuthenticator.signIn(email, password)
      .then(u => {
        if (u.challengeName === 'NEW_PASSWORD_REQUIRED') setChallengeUser(u);
      });
  }, []);
  // sign-out callback
  const signOut = useCallback<SignOutCallbackType>(() => {
    return AmplifyAuthenticator.signOut()
  }, []);
  // change password callback
  const completeNewPassword = useCallback<ChangePasswordCallbackType>((password) => {
    return AmplifyAuthenticator.completeNewPassword(challengeUser, password)
      .then(() => setChallengeUser(undefined));
  }, [challengeUser]);
  // change attributes callback
  const changeAttributes = useCallback<ChangeAttributesCallbackType>(async (name, phone) => {
    const user = await AmplifyAuthenticator.currentAuthenticatedUser();
    return AmplifyAuthenticator.updateUserAttributes(user, {
      name: name,
      phone_number: phone
    });
  }, []);
  const saveAvatar = useCallback<SaveAvatarCallbackType>((file) => {
    return saveAmplifyAvatar(file);
  }, [])
  // calculate challenge
  const challenge = useMemo(() => {
    if (pending) return Challenge.pending;
    else if (challengeUser) return Challenge.setNewPassword;
    else if (!user) return Challenge.signIn;
    else if (user) return Challenge.signedIn;
    return Challenge.error;
  }, [pending, user, challengeUser]);
  // get token
  useEffect(() => {
    AmplifyAuthenticator.currentSession()
      .then(session => setToken(session.getIdToken().getJwtToken()))
      .catch(() => setToken(undefined))
  }, [user]);
  // check session on start up
  useEffect(() => {
    // set loading
    setPending(true);
    // check session
    AmplifyAuthenticator.currentSession()
      .then((session) => {
        if (session && session.isValid()) evaluateUser();
        else setPending(false);
      })
      .catch(() => setPending(false))
  }, []);
  // on start-up listen
  useEffect(() => {
    Hub.listen('auth', authListener);
    return () => Hub.remove('auth', authListener)
  }, [authListener]);
  // create auth object
  return (
    <Auth.Provider value={{user, token, challenge, signOut, signIn, completeNewPassword, changeAttributes, saveAvatar, loginUrl}}>
      {children}
    </Auth.Provider>
  );
}

