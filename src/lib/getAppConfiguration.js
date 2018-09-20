import config from './config';
import fetch from './fetch';

export default function getAppConfiguration(hostName) {
  const baseUrl = config.accessibilityCloudBaseUrl;
  const token = config.accessibilityCloudAppToken;
  const url = `${baseUrl}/apps/${hostName}.json?appToken=${token}`;
  console.log(hostName);
  return fetch(url).then(r => r.json());
}
