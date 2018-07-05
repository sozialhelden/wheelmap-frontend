// @flow
import UAParser from 'ua-parser-js';

export function isTouchDevice() {
  return window.navigator.maxTouchPoints > 0 ||
    window.navigator.userAgent.match(/iPhone/) ||
    window.navigator.userAgent.match(/iPad/);
}

// See https://github.com/faisalman/ua-parser-js for documentation
const parser = new UAParser();
export const userAgent = parser.getResult();
