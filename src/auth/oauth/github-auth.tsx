import {deleteSession, getAccessTokenFromSession, getUser} from './auth';
import {Auth} from '../contexts/auth';
import {UserType} from '../types/user';
import {WithChildren} from 'types/withChildren';
import {useEffect, useState} from 'react';
// import {OAUTH_REDIRECT_PATH} from "auth/config/consts";
import {Challenge} from "auth/types/auth";

// const redirectPath = OAUTH_REDIRECT_PATH;

// functions
const convertUser = (user: any) => new Promise<UserType>((resolve) => resolve({
  name: user.name,
  bio: user.bio,
  email: user.email,
  uid: user.id,
  avatar: user.avatar_url,
}));


export default function GithubAuthProvider ({children} : WithChildren) {
  // states
  const [user, setUser] = useState<UserType | null>(null);
  const [pending, setPending] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  // load access token from session
  useEffect(() => {
    // get access token from session
    getAccessTokenFromSession()
      .then(token => setAccessToken(token))
      .catch(() => setPending(false));
  }, []);
  // handle session
  useEffect( () => {
    // check access token
    if(!accessToken) return;
    // get and set user
    getUser(accessToken)
      .then(u => u ? convertUser(u) : null)
      .then(u => setUser(u))
      .catch(e => {
        console.error(e);
        setPending(false);
      });
  }, [accessToken]);
  // when user is valid, unset pending
  useEffect(() => {
    if (user) setPending(false);
  }, [user]);
  // logout callback
  const signOut = () => new Promise<void>(() => {
    // set pending
    setPending(true);
    // delete session
    deleteSession();
    // unset user and pending
    setUser(null);
    setPending(false);
  });
  // accessToken callback
  // TODO: also getAccessToken
  // const updateAccessToken = (token : string) => {
  //   setPending(true);
  //   setAccessToken(token);
  // }
  const authContextObject = {
    user,
    challenge: pending ? Challenge.pending : Challenge.error, // TODO: must be updated
    signOut
  }
  // render
  return (
    <Auth.Provider value={authContextObject}>
      {children}
    </Auth.Provider>
  )
}
