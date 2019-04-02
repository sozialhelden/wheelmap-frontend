// @flow

import L from 'leaflet';
import * as React from 'react';
import ReactDOM from 'react-dom';
import * as markers from '../icons/markers';
import type { NodeProperties } from '../../lib/Feature';
import MarkerIcon from './MarkerIcon';
import { type CategoryLookupTables } from '../../lib/Categories';
import type { Feature } from '../../lib/Feature';
import { t } from 'ttag';
import styled from 'styled-components';

// Extend Leaflet-icon to support colors and category images

type Options = typeof L.Icon.options & {
  onClick: (featureId: string, properties: ?NodeProperties) => void,
  hrefForFeature: (featureId: string) => ?string,
  feature: Feature,
  categories: CategoryLookupTables,
  highlighted?: boolean,
};

const MappingEventMarkerSVG = markers['mappingEvent'];

const ICON_SIZES = { small: 25, medium: 40, big: 60 };

const StyledMappingEventMarkerSVG = styled(MappingEventMarkerSVG)`
  position: relative;
  left: calc(50% - ${props => ICON_SIZES[props.size] / 2}px);
  top: calc(50% - ${props => ICON_SIZES[props.size]}px);
  width: ${props => ICON_SIZES[props.size]}px;
  height: ${props => ICON_SIZES[props.size]}px;
`;

export default class MappingEventMarkerIcon extends MarkerIcon {
  options: Options;

  createIcon() {
    const link = document.createElement('a');
    const { feature } = this.options;
    const properties = feature.properties;
    const featureId = properties.id || properties._id || feature._id;
    link.href = this.options.hrefForFeature();

    const iconClassNames = `marker-icon${this.options.highlighted ? ' highlighted-marker' : ''}`;

    ReactDOM.render(
      <StyledMappingEventMarkerSVG
        className={iconClassNames}
        shadowed={this.options.highlighted}
        size={this.options.highlighted ? 'big' : 'small'}
        centered
        ariaHidden={this.options.highlighted}
      />,
      link
    );
    link.style.touchAction = 'none';

    link.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      this.options.onClick(featureId, properties);
    });
    this._setIconStyles(link, 'icon');

    const accessibleName = t`Mapping Event Map Marker`;
    link.setAttribute('aria-label', accessibleName);
    return link;
  }
}
