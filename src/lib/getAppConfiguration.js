import env from './env';
import fetch from './fetch';

export default function getAppConfiguration(hostName) {
  const baseUrl = env.public.accessibilityCloud.baseUrl.cached;
  const token = env.public.accessibilityCloud.appToken;
  const url = `${baseUrl}/apps/${hostName}.json?appToken=${token}`;
  console.log(hostName);
  return fetch(url).then(r => r.json());
}
