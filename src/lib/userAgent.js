// @flow
import UAParser from 'ua-parser-js';

export function isTouchDevice(userAgent?: UAResult = getUserAgent()) {
  // If on client check for touch points.
  if (typeof window !== 'undefined' && window.navigator.maxTouchPoints > 0) {
    return true;
  }

  // If on server check for os name.
  return userAgent.os.name === 'iOS' || userAgent.os.name === 'Android';
}

export type UAOs = {
  name: ?string,
  version: ?string,
};

export type UAResult = {
  os: UAOs,
  ua: string,
};

const parser = new UAParser();
let userAgent: UAResult = parser.getResult();

export function configureUserAgent(userAgentResult: UAResult) {
  userAgent = userAgentResult;
}

export function getUserAgent(): UAResult {
  return userAgent;
}
