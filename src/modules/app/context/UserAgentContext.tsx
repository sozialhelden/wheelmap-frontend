import { type ReactNode, createContext, useContext } from "react";
import { UAParser } from "ua-parser-js";

export const UserAgentContext = createContext<UAParser.IResult | null>(null);

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
  return (
    <UserAgentContext.Provider value={parseUserAgentString(userAgent)}>
      {children}
    </UserAgentContext.Provider>
  );
}
