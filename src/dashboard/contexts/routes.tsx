import React, {createContext, useContext} from "react";
import {RouteType} from "dashboard/types/route";

/**
 * The routes context
 */
export const Routes = createContext<RouteType[]>([]);

export function useRoutes () {
  return useContext(Routes);
}
