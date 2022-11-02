import {WithChildren} from "types/withChildren";
import React, {useMemo, useState} from "react";
import {JSX} from "@babel/types";
import {PageContextType, PageType} from "dashboard/types/page";
import {Page} from "dashboard/contexts/page";
import {Config} from "dashboard/contexts/config";
import {ConfigType} from "dashboard/types/config";
import {RouteType} from "dashboard/types/route";
import {Routes} from "dashboard/contexts/routes";
import {useRouter} from "next/router";


type Props = WithChildren & {
  page: PageType,
  config: ConfigType
  routes: RouteType[]
};

export default function PageProvider ({page, config, routes, children} : Props) {
  // calculate default title from route
  const router = useRouter();
  const defaultTitle = useMemo(() => routes.find(r => `/${r.label}` === router.asPath)?.title, [router.asPath, routes]);
  // states
  const [title, setTitle] = useState<string>();
  const [allowKioskMode, setAllowKiosk] = useState<boolean>();
  const [footerContent, setFooterContent] = useState<string | JSX.Element>();
  // generate context
  const context : PageContextType = {
    title: title || defaultTitle || page.title,
    allowKioskMode: allowKioskMode !== undefined ? allowKioskMode : (page.allowKioskMode || false),
    footerContent: footerContent || page.footerContent || 'Next Dashboard',
    setTitle : (t) => setTitle(t),
    setAllowKioskMode : (a) => setAllowKiosk(a),
    setFooterContent : (f) => setFooterContent(f),
  };
  // update
  return (
    <Page.Provider value={context} >
      <Config.Provider value={config}>
        <Routes.Provider value={routes}>
          {children}
        </Routes.Provider>
      </Config.Provider>
    </Page.Provider>
  )
}
