import * as React from 'react';
import { AccessibilityCloudFeature } from '../../lib/Feature';
import { translatedStringFromObject } from '../../lib/i18n';
import Link, { RouteConsumer } from '../Link/Link';
import AppContext from '../../AppContext';
import env from '../../lib/env';
import { TextPlaceholder } from './TextPlaceholder';

export default function PlaceInfoLink({ _id, nameOverride }: { _id: string | null; nameOverride?: string }) {
  const [placeInfo, setPlaceInfo] = React.useState<AccessibilityCloudFeature | null>(null);
  const appContext = React.useContext(AppContext);
  const appToken = appContext.app.tokenString;

  React.useEffect(() => {
    if (!_id || nameOverride) {
      setPlaceInfo(null);
      return;
    }
    const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL;
    fetch(`${baseUrl}/place-infos/${_id}.json?appToken=${appToken}`)
      .then(response => response.json())
      .then(setPlaceInfo);
  }, [_id, appToken, nameOverride]);

  return <RouteConsumer>
    {context => {
      let params = { ...context.params, id: _id };
      return (
        <Link
          to={'placeDetail'}
          params={params}
          className="link-button"
        >
          <div>
            {nameOverride || (placeInfo ? translatedStringFromObject(placeInfo.properties.name) : <TextPlaceholder>{'Testington Townhall'}</TextPlaceholder>)}
          </div>
        </Link>
      );
    }}
  </RouteConsumer>;
}
