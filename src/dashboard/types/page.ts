import {JSX} from "@babel/types";

export type PageType = {
  title ?: string
  allowKioskMode ?: boolean
  footerContent ?: string | JSX.Element
}

export type PageContextType = PageType & {
  setTitle ?: (title: string) => void
  setAllowKioskMode ?: (allow: boolean) => void
  setFooterContent ?: (footer: string | JSX.Element) => void
}
