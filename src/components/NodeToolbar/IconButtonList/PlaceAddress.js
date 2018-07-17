// @flow

import * as React from 'react';
import type {
  Feature,
  NodeProperties,
  WheelmapProperties,
  AccessibilityCloudProperties,
} from '../../../lib/Feature';

import getAddressString from '../../../lib/getAddressString';
import Address from '../Address';
import get from 'lodash/get';
import { generateMapsUrl } from '../../../lib/generateMapsUrls';
import { generateShowOnOsmUrl } from '../../../lib/generateOsmUrls';
import { placeNameFor } from '../../../lib/Feature';
import openButtonCaption from '../../../lib/openButtonCaption';
import { Category } from '../../../lib/Categories';

function getAddressForACProperties(properties: AccessibilityCloudProperties): ?string {
  if (typeof properties.address === 'string') return properties.address;
  if (typeof properties.address === 'object') {
    if (typeof properties.address.full === 'string') return properties.address.full;
  }
  return null;
}


function getAddressForProperties(properties: NodeProperties): ?string {
  if (properties.address) {
    return getAddressForACProperties(((properties: any): AccessibilityCloudProperties));
  }
  return getAddressString(((properties: any): WheelmapProperties));
}


type Props = {
  feature: ?Feature,
  category: ?Category,
};


export default class PlaceAddress extends React.Component<Props, void> {
  render() {
    const feature = this.props.feature;

    if (!feature || !feature.properties) return null;

    const placeName = placeNameFor(feature.properties, this.props.category);
    const openInMaps = generateMapsUrl(feature, placeName);
    const showOnOsmUrl = generateShowOnOsmUrl(feature);
    const address = getAddressForProperties(feature.properties);
    const addressString = address && address.replace(/,$/, '').replace(/^,/, '');

    return <React.Fragment>
      {openInMaps && <a className="link-button" href={openInMaps.url}>{addressString || openInMaps.caption}</a>}
      {showOnOsmUrl && <a className="link-button" href={showOnOsmUrl} target="_blank">
        {openButtonCaption('OpenStreetMaps')}
      </a>}
    </React.Fragment>
  }
}
