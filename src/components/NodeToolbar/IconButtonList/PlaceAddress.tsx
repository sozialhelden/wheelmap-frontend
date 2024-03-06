import * as React from 'react';
import {
  AccessibilityCloudProperties,
  Feature,
  NodeProperties,
  isWheelmapProperties,
} from '../../../lib/Feature';

import { Category } from '../../../lib/Categories';
import { placeNameFor } from '../../../lib/Feature';
import { generateMapsUrl } from '../../../lib/generateMapsUrls';
import { generateShowOnOsmUrl } from '../../../lib/generateOsmUrls';
import getAddressString from '../../../lib/getAddressString';
import openButtonCaption from '../../../lib/openButtonCaption';
import PlaceIcon from '../../icons/actions/Place';
import RouteIcon from '../../icons/actions/Route';

import getAddressStringFromA11yJSONFeature from '../../../lib/getAddressStringFromA11yJSONFeature';
import { UAResult } from '../../../lib/userAgent';

function getAddressForACProperties(properties: AccessibilityCloudProperties): string | null {
  if (typeof properties.address === 'string') return properties.address;
  if (typeof properties.address === 'object') {
    switch (true) {
      case typeof properties.address.full === 'string':
        return properties.address.full;
      case typeof properties.address.text === 'string':
        return properties.address.text;
      case (typeof properties.address.full !== 'string' || typeof properties.address.text !== 'string'):
        return getAddressStringFromA11yJSONFeature(properties.address);
      default:
        return null;
    }
  }
  return null;
}

function getAddressForProperties(properties: NodeProperties): string | null {
  if (!isWheelmapProperties(properties)) {
    return getAddressForACProperties(properties);
  }
  return getAddressString(properties);
}

type Props = {
  feature: Feature | null,
  category: Category | null,
  userAgent: UAResult,
};

export default class PlaceAddress extends React.Component<Props, {}> {
  render() {
    const { feature, userAgent } = this.props;

    if (!feature || !feature.properties) return null;

    const placeName = placeNameFor(feature.properties, this.props.category);
    const openInMaps = generateMapsUrl(userAgent, feature, placeName);
    const showOnOsmUrl = generateShowOnOsmUrl(feature);
    const address = getAddressForProperties(feature.properties);
    const addressString = address && address.replace(/,$/, '').replace(/^,/, '');

    return (
      <React.Fragment>
        {openInMaps && (
          <a className="link-button" href={openInMaps.url}>
            <RouteIcon />
            <span>{addressString || openInMaps.caption}</span>
          </a>
        )}
        {showOnOsmUrl && (
          <a className="link-button" href={showOnOsmUrl} target="_blank" rel="noopener noreferrer">
            <PlaceIcon />
            <span>{openButtonCaption('OpenStreetMap')}</span>
          </a>
        )}
      </React.Fragment>
    );
  }
}
