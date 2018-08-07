// @flow

import { t } from 'ttag';
import * as React from 'react';
import SourceLink from '../SourceLink';
import { accessibilityCloudFeatureFrom } from '../../../lib/Feature';
import type { Feature } from '../../../lib/Feature';


type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  equipmentInfoId: ?string,
};


const captions = {
  // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
  infoPageUrl: (sourceNameString) => t`Open on ${sourceNameString}`,
  // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
  editPageUrl: (sourceNameString) => t`Improve on ${sourceNameString}`,
};


export default function ExternalInfoAndEditPageLinks(props: Props) {
  const acFeature = accessibilityCloudFeatureFrom(props.feature);
  if (!acFeature) return null;
  const properties = acFeature.properties;
  if (!properties) return null;
  const links = ['infoPageUrl', 'editPageUrl'].map((propertyName) => {
    return <SourceLink
      key={propertyName}
      properties={properties}
      knownSourceNameCaption={captions[propertyName]}
      propertyName={propertyName}
    />;
  });

  if (properties && properties.infoPageUrl === properties.editPageUrl) {
    links.shift();
  }

  return links;
}

