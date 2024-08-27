import React from 'react'

const CountryContext = React.createContext<string | null>(null)
export default CountryContext

CountryContext.displayName = 'CountryContext'

export function useCountry() {
  return React.useContext(CountryContext)
}
