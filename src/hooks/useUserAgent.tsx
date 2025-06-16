import { type ReactNode, createContext, useContext } from "react";
import { UAParser } from "ua-parser-js";

type UserAgentContextType = {
  original: string;
  userAgent: UAParser.IResult | null;
};

export const UserAgentContext = createContext<UserAgentContextType>({
  original: "",
  userAgent: null,
});

export function useUserAgent() {
  return useContext(UserAgentContext);
}

export function parseUserAgentString(userAgentString: string) {
  return new UAParser(userAgentString).getResult();
}

export function UserAgentContextProvider({
  children,
  userAgent,
}: { children: ReactNode; userAgent: string }) {
  // TODO: move more utility functions to this context, e.g. isMobile, isIOS, etc.
  const value = {
    original: userAgent,
    userAgent: parseUserAgentString(userAgent),
  };

  return (
    <UserAgentContext.Provider value={value}>
      {children}
    </UserAgentContext.Provider>
  );
}
