import React, {createContext, useContext} from "react";
import {PageContextType} from "../types/page";

/**
 * The page context
 */
export const Page = createContext<PageContextType>({
  title: '<<No Page Context>>',
  allowKioskMode: false
});

export function usePage () {
  return useContext(Page);
}
