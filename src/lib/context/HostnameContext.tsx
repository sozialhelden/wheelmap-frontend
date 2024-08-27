import React from 'react';

export const HostnameContext = React.createContext<string | null>(null);

HostnameContext.displayName = 'HostnameContext';

export default function useHostname() {
  return React.useContext(HostnameContext);
}
