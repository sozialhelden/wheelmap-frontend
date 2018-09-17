// @flow
import UAParser from 'ua-parser-js';

export function isTouchDevice() {
  return (
    typeof window !== 'undefined' &&
    (window.navigator.maxTouchPoints > 0 ||
      window.navigator.userAgent.match(/iPhone/) ||
      window.navigator.userAgent.match(/iPad/))
  );
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
export const userAgent = parser.getResult();
