// @flow

import { t } from 'c-3po';
import get from 'lodash/get';
import uniq from 'lodash/uniq';
import * as React from 'react';
import type { RouterHistory } from 'react-router-dom';

import type { Feature } from '../../lib/Feature';
import { generateMapsUrl } from '../../lib/generateMapsUrls';
import { generateShowOnOsmUrl } from '../../lib/generateOsmUrls';

import SourceLink from './SourceLink';
import LicenseHint from './LicenseHint';
import PhoneNumberLink from './PhoneNumberLink';
import { placeNameFor, accessibilityCloudFeatureFrom } from '../../lib/Feature';
import styled from 'styled-components';


type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  equipmentInfoId: ?string,
  isReportMode: boolean,
  history: RouterHistory,
};


const captions = {
  // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
  infoPageUrl: (sourceNameString) => t`Open on ${sourceNameString}`,
  // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
  editPageUrl: (sourceNameString) => t`Improve on ${sourceNameString}`,
  // translator: Button caption shown in the PoI details panel
  editButton: t`Edit`,
  // translator: Button caption shown in the PoI details panel
  showOnOsm: t`Open on OpenStreetMap`,
  // translator: Prefix for the sources on the PoI details panel
  source: t`Source:`,
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


function sourceIdsForFeature(feature: ?Feature): string[] {
  if (!feature) return [];

  const properties = feature.properties;
  if (!properties) return [];

  const idsToEquipmentInfos = typeof properties.equipmentInfos === 'object' ? properties.equipmentInfos : null;
  const equipmentInfos = idsToEquipmentInfos ? Object
    .keys(idsToEquipmentInfos)
    .map(_id => idsToEquipmentInfos[_id]) : [];
  const equipmentInfoSourceIds = equipmentInfos.map(equipmentInfo => get(equipmentInfo, 'properties.sourceId'));
  const disruptionSourceIds = equipmentInfos.map(equipmentInfo => get(equipmentInfo, 'properties.lastDisruptionProperties.sourceId'));
  const placeSourceId = properties && typeof properties.sourceId === 'string' ? properties.sourceId : null;

  return uniq([
    placeSourceId,
    ...equipmentInfoSourceIds,
    ...disruptionSourceIds,
  ].filter(Boolean));
}

function Sources(props: Props) {
  const sourceIds = sourceIdsForFeature(props.feature);
  return <section className="sources">
    {sourceIds.length ? `${captions.source} ` : null}
    <ul>
      {sourceIds.map(sourceId => <LicenseHint key={sourceId} sourceId={sourceId} />)}
    </ul>
  </section>;
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

  const placeName = placeNameFor(get(props, 'feature.properties'), props.category);
  const openInMaps = generateMapsUrl(feature, placeName);
  const showOnOsmLink = generateShowOnOsmUrl(feature);
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

    {openInMaps && <a className="link-button" href={openInMaps.url}>{openInMaps.caption}</a>}
    {showOnOsmLink && <a className="link-button" href={showOnOsmLink}>{captions.showOnOsm}</a>}
    {(isEquipment && phoneNumber) ? <PhoneNumberLink phoneNumber={String(phoneNumber)} /> : null}
    <Sources {...props} />
  </React.Fragment>;
}
