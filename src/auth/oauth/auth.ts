import {v4 as uuidv4} from 'uuid';
import Cookies from 'universal-cookie';
import {parse} from 'cookie';
import CryptoJS from 'crypto-js';
import {UserType} from '../types/user';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {
  OAUTH_ACCESS_URL, OAUTH_USER_URL,
  OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET,
  OAUTH_COOKIE_SECRET,
  OAUTH_LOGIN_URL,
  OAUTH_REDIRECT_PATH,
  OAUTH_SESSION_NAME
} from "auth/config/consts";
import moment from "moment";

export const base64encode = (text : string) => {
  return Buffer.from(text).toString('base64');
}

export const base64decode = (code : string) => {
  return Buffer.from(code, 'base64').toString('ascii');
}

export const encryptSession = (auth : any) => {
  return base64encode(CryptoJS.AES.encrypt(JSON.stringify(auth), OAUTH_COOKIE_SECRET).toString());
}

export const decryptSession = (sessionString : string) => {
  try {
    return JSON.parse(CryptoJS.AES.decrypt(base64decode(sessionString), OAUTH_COOKIE_SECRET).toString(CryptoJS.enc.Utf8));
  } catch(e) {
    console.error(e);
    return undefined;
  }
}

export const getAccessTokenFromAuth = (code: string | string [] | undefined, state: string | string [] | undefined) =>
  new Promise<{auth: any, state : any}>( async (resolve, reject) => {
    // TODO: check state against cookie
    if (!code || !state || (typeof code !== 'string') || (typeof state !== 'string'))
      return reject('no_code_or_state');
    // parse state
    const stateObject = JSON.parse(base64decode(state));
    // generate data for post
    const data = {
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      redirect_uri: stateObject.redirectUri,
      code,
      state,
    };
    // get data
    fetch(OAUTH_ACCESS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async r => r.status !== 200 ? (reject(await r.json())) : r.json())
      .then(r => r.error ? reject(r) : r)
      .then(token => {
        // return token
        return resolve({
          auth: token,
          state: stateObject,
        })
      });
  }
);


export const handleServerSideAuth = async (
  code?: string | string[] | undefined,
  state?: string | string[] | undefined,
  cookie?: string | undefined
) => {
  // switch
  if (code) {
    // get token
    return await getAccessTokenFromAuth(code, state)
      .then(props => ({props}))
      .catch(e => {
        console.error(e);
        return ({props: {}});
      });
  }
  // try to refresh
  const session = getSessionCookie(cookie);
  if (session) {
    // decrypt session
    const decrypted = decryptSession(session);
    // check refresh token
    if (!decrypted?.refresh_token)
      return {props: {}};
    // get props
    return await refreshToken(decrypted.refresh_token)
      .then(auth => ({props: {auth}}))
      .catch(e => {
        console.error('err-decr', e);
        return ({props: {}});
      });
  }
  // abort without data
  return {props: {}};
}


export const refreshToken = (token: string) =>
  new Promise<{auth: any}>( async (resolve, reject) => {
    // generate data for post
    const data = {
      client_id: OAUTH_CLIENT_ID,
      client_secret: OAUTH_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token
    };
    // get data
    fetch(OAUTH_ACCESS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(async r => r.status !== 200 ? (reject(await r.json())) : r.json())
      .then(r => r?.error ? reject(r) : r)
      .then(auth => resolve(auth));
  }
);


export const useLoginUrl = () => {
  const [loginUrl, setLoginUrl] = useState<string>();
  useEffect(() => {
    // get urls
    const url = new URL(window.location.toString());
    const base = window.location.origin;
    // redirect url to redirect to from oauth server
    const rUri = new URL(base);
    rUri.pathname = OAUTH_REDIRECT_PATH;
    // define state
    const state = {
      originUri: url.searchParams.get('origin') || (base + '/'),
      redirectUri: rUri.toString(),
      uuid: uuidv4()
    };
    // generate login url
    const lUrl = new URL(OAUTH_LOGIN_URL);
    lUrl.searchParams.set('client_id', OAUTH_CLIENT_ID);
    lUrl.searchParams.set('redirect_uri', rUri.toString());
    lUrl.searchParams.set('state', base64encode(JSON.stringify(state)));
    // return as string
    setLoginUrl(lUrl.toString());
  }, [])
  // return login url
  return loginUrl;
};


export const getUser = (accessToken : string) => {
  // create and return promise
  return new Promise<UserType | null>((resolve, reject) => {
    // get user
    return fetch(OAUTH_USER_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    })
      .then(async r => r.status !== 200 ? (reject(await r.json())) : r.json())
      .then(u => resolve(u))
  });
}


export const generateLoginPageUrl = (target: string, from : string) => {
  // set url with path and parameters
  const url = new URL(window.location.toString());
  url.pathname = target;
  url.searchParams.set('redirect', from);
  // return
  return url.toString();
}


export const createSession = (auth : any) => {
  // encrypt
  const encrypted = encryptSession(auth);
  // save auth to session
  const cookies = new Cookies();
  cookies.set(OAUTH_SESSION_NAME, encrypted, {
    expires: moment().add(7, "days").toDate(),
    path: '/'
  });
};


export const deleteSession = () => {
  // get session
  const cookies = new Cookies();
  cookies.remove(OAUTH_SESSION_NAME);
}


export const getSession = () => {
  // get session
  const cookies = new Cookies();
  return cookies.get(OAUTH_SESSION_NAME);
}


export function getSessionCookie(cookie : string | undefined) {
  // get cookie and check
  if (!cookie) return undefined;
  // parse cookie
  return parse(cookie)[OAUTH_SESSION_NAME];
}


export const getAccessTokenFromSession = () => new Promise<string>((resolve, reject) => {
  // get session
  const session = getSession();
  // check session
  if (!session) return reject('no_session');
  // decrypt session
  const decrypted = decryptSession(session);
  // return access token
  return resolve(decrypted.access_token);
});


export const useAuthentication = ( auth: any, state: any) => {
  // get router
  const router = useRouter();
  // handle auth
  useEffect(() => {
    if(!auth) return;
    // save auth
    createSession(auth);
    // get target page and redirect
    router?.push(state?.originUri || OAUTH_REDIRECT_PATH).then();
  }, [auth, state, router]);
}
