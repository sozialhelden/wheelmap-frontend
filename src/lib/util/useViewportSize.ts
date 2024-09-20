import { useCallback, useEffect, useState } from 'react'

const getBreakpointSize = (width: number) => (width <= 512 ? 'small' : 'big')

/**
 * Determine the viewport size depending on the inner sizing of the window, useful
 * for handling layout choices depending on the size of the browser
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerHeight,
    height: window.innerHeight,
    size: getBreakpointSize(window.innerWidth),
  } as const)

  const updateWindowSize = useCallback((windowWidth: number, windowHeight: number) => {
    setWindowSize({
      width: windowWidth,
      height: windowHeight,
      size: getBreakpointSize(windowWidth),
    })
  }, [setWindowSize])

  useEffect(() => {
    const handleResize = () => {
      updateWindowSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize) }
  }, [setWindowSize, updateWindowSize])

  return windowSize
}
