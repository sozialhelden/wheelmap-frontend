import useSWR from 'swr';
import { useCurrentApp } from '../context/AppContext';
import { useEnvContext } from '../context/EnvContext';
import { AnyFeature } from '../model/geo/AnyFeature';
import { fetchOneOSMFeature } from './fetchOneOSMFeature';
import { fetchOnePlaceInfo } from './fetchOnePlaceInfo';

export async function fetchMultipleFeatures(
  appToken: string,
  baseUrl: string,
  idsAsString?: string,
): Promise<AnyFeature[] | undefined> {
  const ids = idsAsString.split(',');

  const promises = ids.map((id) => {
    if (id.startsWith('ac:')) {
      return fetchOnePlaceInfo(appToken, id.slice(3)).then(
        (feature) => ({ '@type': 'a11yjson:PlaceInfo', ...feature } as AnyFeature),
      );
    }

    return fetchOneOSMFeature(baseUrl, id).then(
      (feature) => ({
        '@type': 'osm:Feature',
        ...feature,
      } as AnyFeature),
    );
  });

  return Promise.all(promises);
}

export function useMultipleFeatures(ids: string | string[]) {
  const idsAsString = typeof ids === 'string' ? ids : ids.join(',');
  const app = useCurrentApp();
  const appToken = app.tokenString;
  const env = useEnvContext();
  const baseUrl = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;

  const features = useSWR(
    appToken && baseUrl && idsAsString && [appToken, baseUrl, idsAsString],
    fetchMultipleFeatures,
  );
  return features;
}
