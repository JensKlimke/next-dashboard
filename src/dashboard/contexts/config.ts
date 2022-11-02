import {createContext, useContext} from "react";
import {ConfigType} from "dashboard/types/config";

export const Config = createContext<ConfigType>({});

export function useConfig () {
  return useContext(Config);
}
