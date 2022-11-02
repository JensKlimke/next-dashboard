import {WithChildren} from 'types/withChildren';
import {useRouter} from 'next/router';
import {useEffect} from 'react';
import {generateLoginPageUrl} from '../oauth/auth';
import {useAuth} from 'auth/contexts/auth';

export function RequireAuth ({children} : WithChildren) {
  // hooks
  const {user, pending, redirectPath} = useAuth();
  const router = useRouter();
  // handle redirect
  useEffect(() => {
    // when pending abort
    if (pending || user || !redirectPath) return;
    // generate login url
    const loginUrl = generateLoginPageUrl(redirectPath, location.toString());
    // redirect
    router.push(loginUrl).then();
  }, [pending, user, router, redirectPath]);
  // check pending
  if (pending || !user)
    return <></>
  // check user
  return <>{children}</>;
}
