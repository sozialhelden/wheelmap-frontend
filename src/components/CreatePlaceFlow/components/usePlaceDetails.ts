import * as React from 'react';

import { accessibilityCloudFeatureCache } from '../../../lib/cache/AccessibilityCloudFeatureCache';
import type { AccessibilityCloudFeature } from '../../../lib/Feature';

import AppContext from '../../../AppContext';

export type SearchState = 'NoId' | 'Loading' | 'Error' | 'Result';

export default function usePlaceDetails(initialPlaceId: string | null = null) {
  const appContext = React.useContext(AppContext);
  const appToken = appContext.app.tokenString;
  const request = React.useRef<Promise<AccessibilityCloudFeature> | null>(null);
  const [placeId, setPlaceId] = React.useState<string | null>(initialPlaceId);
  const [state, setState] = React.useState<SearchState>('NoId');
  const [place, setPlace] = React.useState<AccessibilityCloudFeature | null>(null);

  React.useEffect(() => {
    if (!placeId) {
      setState('NoId');
      setPlace(null);
      request.current = null;
      return;
    }

    const placeDetailsPromise = accessibilityCloudFeatureCache.fetchFeature(
      placeId,
      appToken,
      false
    );
    request.current = (placeDetailsPromise as Promise<AccessibilityCloudFeature>);
    setPlace(null);
    placeDetailsPromise
      .then(result => {
        if (request.current === placeDetailsPromise) {
          setPlace(result);
          setState('Result');
          request.current = null;
        }
      })
      .catch(() => {
        if (request.current === placeDetailsPromise) {
          setState('Error');
          request.current = null;
        }
      });

    return () => {
      request.current = null;
    };
  }, [placeId, appToken, setState, setPlace]);

  return [state, place, setPlaceId];
}
