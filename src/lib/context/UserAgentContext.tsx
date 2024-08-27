import { IncomingMessage } from 'http'
import React from 'react'
import { UAParser } from 'ua-parser-js'

export const UserAgentContext = React.createContext<IUAParser.IResult | null>(
  null,
)

UserAgentContext.displayName = 'UserAgentContext'

export default function useUserAgent() {
  return React.useContext(UserAgentContext)
}

export function getUserAgentString(req?: IncomingMessage) {
  if (req) {
    return req.headers['user-agent']
  }

  if (typeof window !== 'undefined') {
    return window.navigator.userAgent
  }

  throw new Error(
    "We're neither on a NodeJS server nor in a browser. Environment is not supported or you forgot to supply a req parameter.",
  )
}

export function parseUserAgentString(userAgentString: string) {
  const userAgentParser = new UAParser(userAgentString)
  const userAgent = userAgentParser.getResult()
  return userAgent
}

export function isTouchDevice(userAgent: IUAParser.IResult) {
  // If on client check for touch points.
  if (typeof window !== 'undefined' && window.navigator.maxTouchPoints > 0) {
    return true
  }

  // If on server check for os name.
  return userAgent.os.name === 'iOS' || userAgent.os.name === 'Android'
}
