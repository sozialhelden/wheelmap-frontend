// @flow

import { t } from 'c-3po';
import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';
import styled from 'styled-components';

import type { Feature } from '../../../lib/Feature';
import openButtonCaption from '../../../lib/openButtonCaption';

import SourceLink from '../SourceLink';
import { accessibilityCloudFeatureFrom } from '../../../lib/Feature';

import WorldIcon from '../../icons/actions/World';
import FlagIcon from '../../icons/actions/Flag';


type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  equipmentInfoId: ?string,
  history: RouterHistory,
};


const captions = {
  // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
  infoPageUrl: (sourceNameString) => t`Open on ${sourceNameString}`,
  // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
  editPageUrl: (sourceNameString) => t`Improve on ${sourceNameString}`,
};


export default function ExternalInfoAndEditPageLinks(props: { feature: ?Feature }) {
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

