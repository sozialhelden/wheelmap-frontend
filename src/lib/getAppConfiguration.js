// @flow

import fetch from './fetch';
import env from './env';

export default function getAppConfiguration(hostName: string) {
  const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
  const token = env.REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN || '';
  const url = `${baseUrl}/apps/${hostName}.json?appToken=${token}`;
  console.log(hostName);
  return fetch(url).then(r => r.json());
}
