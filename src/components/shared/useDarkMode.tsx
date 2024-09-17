import * as React from 'react'

function getDarkModeSetting(): boolean | undefined {
  if (typeof window === 'undefined') {
    return undefined
  }
  return (
    window.matchMedia
    && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}

/**
 * A React Hook returning a boolean value that is `true` when the user switched on dark mode,
 * `false` otherwise.
 */
export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = React.useState(getDarkModeSetting())

  const handleChange = React.useCallback(() => {
    const newDarkMode = getDarkModeSetting()
    setIsDarkMode(newDarkMode)
    console.log('Dark mode changed to', newDarkMode)
    if (newDarkMode) {
      document.body.classList.add('bp5-dark')
      document.body.classList.remove('bp5-light')
    } else {
      document.body.classList.add('bp5-light')
      document.body.classList.remove('bp5-dark')
    }
  }, [])

  React.useEffect(() => {
    if (window.matchMedia === undefined) {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleChange)
    handleChange()

    // eslint-disable-next-line consistent-return
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [handleChange])

  return isDarkMode
}
