import config from './config';
import fetch from './fetch';

export type ClientSideConfiguration = {
  logoURL: string,
  allowedBaseURLs: Array<string>,
  includeSourceIds: Array<string>,
  excludeSourceIds: Array<string>,
  textContent: {
    onboarding: {
      headerMarkdown: string,
    },
  },
  customMainMenuLinks: Array<Link>,
  addPlaceURL: string,
};

export async function getAppConfiguration(hostName): Promise<ClientSideConfiguration> {
  const baseUrl = config.accessibilityCloudBaseUrl;
  const token = config.accessibilityCloudAppToken;
  const url = `${baseUrl}/apps/${hostName}.json?appToken=${token}`;
  console.log(hostName);
  const response = await fetch(url);
  const appJSON = await response.json();
  return appJSON.clientSideConfiguration;
}
