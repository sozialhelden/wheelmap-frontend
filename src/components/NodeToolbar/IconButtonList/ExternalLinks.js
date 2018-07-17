// @flow

import { t } from 'c-3po';
import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';
import styled from 'styled-components';

import type { Feature } from '../../../lib/Feature';
import openButtonCaption from '../../../lib/openButtonCaption';

import SourceLink from '../SourceLink';
import PhoneNumberLink from './PhoneNumberLink';
import { accessibilityCloudFeatureFrom } from '../../../lib/Feature';


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
  // translator: Button caption shown in the PoI details panel
  editButton: t`Edit`,
};


function ExternalInfoAndEditPageLinks(props: { feature: ?Feature }) {
  const acFeature = accessibilityCloudFeatureFrom(props.feature);
  if (!acFeature) return null;
  const properties = acFeature.properties;

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

  return <React.Fragment>{links}</React.Fragment>;
}


const NonBreakingLink = styled.a`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;


export default function ExternalLinks(props: Props) {
  const isEquipment = !!props.equipmentInfoId;
  const feature = props.feature;
  if (!feature) return [];

  const properties = feature.properties;
  if (!properties) return [];

  const placeWebsiteUrl = properties.placeWebsiteUrl || properties.website;
  const phoneNumber: ?string = properties.phoneNumber || properties.phone;

  const placeWebsiteLink = (typeof placeWebsiteUrl === 'string') &&
    <NonBreakingLink className="place-website-url link-button" href={placeWebsiteUrl}>
      {placeWebsiteUrl}
    </NonBreakingLink>;

  return <React.Fragment>
    <ExternalInfoAndEditPageLinks feature={props.feature} />
    {phoneNumber ? <PhoneNumberLink phoneNumber={phoneNumber} /> : null}
    {placeWebsiteLink}

    {isEquipment ? null : <button
      className="link-button full-width-button"
      onClick={() => {
        if (typeof props.onOpenReportMode === 'function') props.onOpenReportMode();
      }}
    >
      {captions.editButton}
    </button>}
  </React.Fragment>;
}
