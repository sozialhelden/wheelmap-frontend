import type { IncomingMessage } from "node:http";
import React from "react";
import { UAParser } from "ua-parser-js";

export const UserAgentContext = React.createContext<UAParser.IResult | null>(
  null,
);

UserAgentContext.displayName = "UserAgentContext";

export default function useUserAgent() {
  return React.useContext(UserAgentContext);
}

export function getUserAgentString(req?: IncomingMessage) {
  if (req) {
    return req.headers["user-agent"];
  }

  if (typeof window !== "undefined") {
    return window.navigator.userAgent;
  }

  throw new Error(
    "We're neither on a NodeJS server nor in a browser. Environment is not supported or you forgot to supply a req parameter.",
  );
}

export function parseUserAgentString(userAgentString: string) {
  const userAgentParser = new UAParser(userAgentString);
  return userAgentParser.getResult();
}

export function UserAgentContextProvider({ children, userAgentString }) {
  return (
    <UserAgentContext.Provider value={parseUserAgentString(userAgentString)}>
      {children}
    </UserAgentContext.Provider>
  );
}
