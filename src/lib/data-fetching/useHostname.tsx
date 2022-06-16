import { IncomingMessage } from "http";
import React from "react";

export const HostnameContext = React.createContext<string | null>(null);

HostnameContext.displayName = "HostnameContext";

export default function useHostname() {
  return React.useContext(HostnameContext);
}

export function getHostnameString(req?: IncomingMessage): string {
  if (req) {
    return req.headers["host"];
  }

  if (typeof window !== "undefined") {
    return window.location.hostname;
  }

  throw new Error(
    "We're neither on a NodeJS server nor in a browser. Environment is not supported or you forgot to supply a req parameter."
  );
}
