import { t } from 'ttag';
import * as React from 'react';
import SourceLink, { PropertyName } from '../SourceLink';
import { AppContextConsumer } from '../../../AppContext';
import { PlaceInfo } from '@sozialhelden/a11yjson';

type Props = {
  feature: PlaceInfo | null;
  featureId: string | number | null;
  equipmentInfoId: string | null;
};

const captions = {
  // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
  infoPageUrl: sourceNameString => t`Open on ${sourceNameString}`,
  // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
  editPageUrl: sourceNameString => t`Add info on ${sourceNameString}`,
};

export default function ExternalInfoAndEditPageLinks(props: Props): JSX.Element {
  const { feature } = props;
  if (!feature) return null;
  const properties = feature.properties;
  if (!properties) return null;
  const links = ['infoPageUrl', 'editPageUrl'].map((propertyName: PropertyName) => {
    return (
      <AppContextConsumer key={propertyName}>
        {appContext => (
          <SourceLink
            key={propertyName}
            properties={properties}
            knownSourceNameCaption={captions[propertyName]}
            propertyName={propertyName}
            appToken={appContext.app.tokenString}
          />
        )}
      </AppContextConsumer>
    );
  });

  if (properties && properties.infoPageUrl === properties.editPageUrl) {
    links.shift();
  }

  return <>{links}</>;
}
