import React, { useCallback, useEffect, useState } from 'react'

// Why  do we need this, if we always globally have window.innerWidth and window.innerHeight anyway?

export type WindowContextType = {
  width: number;
  height: number;
  userAgent: string;
};

export const WindowContext = React.createContext<WindowContextType | undefined>(
  undefined,
)

export function useWindowContext() {
  return React.useContext(WindowContext)
}

export default function WindowContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [userAgent, setUserAgent] = useState(window.navigator.userAgent)

  const handleResize = useCallback(() => {
    setWidth(window.innerWidth)
    setHeight(window.innerHeight)
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return (
    <WindowContext.Provider value={{ width, height, userAgent }}>
      {children}
    </WindowContext.Provider>
  )
}
