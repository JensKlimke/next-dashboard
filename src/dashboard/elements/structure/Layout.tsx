import React from 'react';
import {useAtom} from "jotai";
import Kiosk from "./Kiosk";
import Dashboard from "./Dashboard";
import {kioskAtom} from "../../atoms/kiosk";
import {WithChildren} from "types/withChildren";
import {useRouter} from "next/router";
import {AMPLIFY_LOGIN_PATH, GITHUB_LOGIN_PATH} from "auth/config/consts";
import Blank from "dashboard/elements/structure/Blank";

export default function Layout({children} : WithChildren) {
  // kiosk mode state
  const [kioskMode, setKioskMode] = useAtom(kioskAtom);
  // get router
  const router = useRouter();
  // render, TODO: do this differently: use another logic to chose Blank Wrapper
  if (router.asPath.startsWith(GITHUB_LOGIN_PATH) || router.asPath.startsWith(AMPLIFY_LOGIN_PATH)) {
    return (
      <Blank>
        {children}
      </Blank>
    );
  } else if (kioskMode) {
    return (
      <Kiosk onCloseKiosk={() => setKioskMode(false)}>
        {children}
      </Kiosk>
    );
  } else {
    return (
      <Dashboard onOpenKiosk={() => setKioskMode(true)}>
        {children}
      </Dashboard>
    );
  }

}
