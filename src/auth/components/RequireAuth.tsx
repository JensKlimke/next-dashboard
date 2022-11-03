import {WithChildren} from 'types/withChildren';
import {useRouter} from 'next/router';
import {useEffect, useMemo} from 'react';
import {generateLoginPageUrl} from '../oauth/auth';
import {useAuth} from 'auth/contexts/auth';
import {Challenge} from "auth/types/auth";

export function RequireAuth ({children} : WithChildren) {
  // hooks
  const {user, challenge, loginUrl} = useAuth();
  const router = useRouter();
  // get states
  const invalid = useMemo(() => {
    return challenge === Challenge.pending;
  }, [challenge])
  // handle redirect
  useEffect(() => {
    // when pending abort
    if (user || !loginUrl || invalid || !router) return;
    // generate login url
    const url = generateLoginPageUrl(loginUrl, location.toString());
    // redirect
    router.push(url).then();
  }, [user, invalid, loginUrl, router]);
  // check pending
  if (invalid || !user)
    return <></>
  // return children
  return <>{children}</>;
}
