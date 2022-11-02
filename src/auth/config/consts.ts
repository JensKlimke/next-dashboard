// frontend urls
export const GITHUB_LOGIN_PATH  = process.env.NEXT_PUBLIC_OAUTH_LOGIN_PATH || '/auth/github';
export const AMPLIFY_LOGIN_PATH = process.env.NEXT_PUBLIC_EMAIL_PASSWORD_LOGIN_PATH || '/auth/amplify';

// auth urls
export const OAUTH_USER_URL      = process.env.NEXT_PUBLIC_AUTH_GITHUB_USER_URL || 'https://api.github.com/user';
export const OAUTH_LOGIN_URL     = process.env.NEXT_PUBLIC_AUTH_LOGIN_URL || 'https://github.com/login/oauth/authorize';
export const OAUTH_ACCESS_URL    = process.env.NEXT_PUBLIC_AUTH_ACCESS_TOKEN_URL || 'https://github.com/login/oauth/access_token';
export const OAUTH_REDIRECT_PATH = process.env.NEXT_PUBLIC_AUTH_REDIRECT_PATH || GITHUB_LOGIN_PATH;

// secrets and IDs
export const OAUTH_CLIENT_SECRET  = process.env.AUTH_CLIENT_SECRET || '';
export const OAUTH_CLIENT_ID      = process.env.NEXT_PUBLIC_AUTH_CLIENT_ID || '';
export const OAUTH_SESSION_NAME   = process.env.NEXT_PUBLIC_AUTH_SESSION_NAME || 'auth';
export const OAUTH_COOKIE_SECRET  = process.env.NEXT_PUBLIC_COOKIE_SECRET || 'some-random-string-with-32-chars';

