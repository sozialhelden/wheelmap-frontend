import { useCallback, useEffect, useState } from 'react'
import { useIsomorphicLayoutEffect } from '../../components/shared/useIsomorphicLayoutEffect'

const getBreakpointSize = (width: number) => (width <= 512 ? 'small' : 'big')

/**
 * Determine the viewport size depending on the inner sizing of the window, useful
 * for handling layout choices depending on the size of the browser
 */
export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: global.window?.innerHeight,
    height: global.window?.innerHeight,
    size: getBreakpointSize(global.window?.innerWidth),
  } as const)

  const updateWindowSize = useCallback((windowWidth: number, windowHeight: number) => {
    setWindowSize({
      width: windowWidth,
      height: windowHeight,
      size: getBreakpointSize(windowWidth),
    })
  }, [])

  useIsomorphicLayoutEffect(() => {
    const handleResize = () => {
      updateWindowSize(global.window?.innerWidth, global.window?.innerHeight)
    }

    global.window?.addEventListener('resize', handleResize)
    handleResize();
    return () => { global.window?.removeEventListener('resize', handleResize) }
  }, [updateWindowSize])

  return windowSize
}
