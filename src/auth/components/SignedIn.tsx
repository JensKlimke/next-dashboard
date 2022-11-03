import React, {useMemo} from "react";
import {Button} from "react-bootstrap";
import Link from "next/link";
import {SignOutCallbackType} from "auth/types/auth";
import {UserType} from "auth/types/user";

export default function SignedIn({user, signOut} : {user: UserType, signOut: SignOutCallbackType }) {
  // get target page
  const target = useMemo(() => {
    const lUrl = new URL(location.toString());
    return lUrl.searchParams.get('redirect') || undefined;
  }, [location]);
  // render
  return (
    <>
      <span>You are logged in as {user.name} - <Link href={target || '/'}>Back</Link></span>
      <hr />
      <div className="d-grid gap-2">
        <Button onClick={signOut}>logout</Button>
      </div>
    </>
  );

}
