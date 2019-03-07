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

const EventMarkerSVG = markers['event'];

const StyledEventMarkerSVG = styled(EventMarkerSVG)`
  width: 25px;
  height: 25px;

  &:not(.highlighted-marker) {
    background-color: #226be591;
    box-shadow: 0px 0px 200px 100px #226be5b0;
  }

  &.highlighted-marker {
    width: 40px;
    height: 40px;
    position: relative;
    left: -8px;
    top: 5px;
  }
`;

export default class EventMarkerIcon extends MarkerIcon {
  options: Options;

  createIcon() {
    const link = document.createElement('a');
    const { feature } = this.options;
    const properties = feature.properties;
    const featureId = properties.id || properties._id || feature._id;
    link.href = this.options.hrefForFeature();

    const iconClassNames = `marker-icon${this.options.highlighted ? ' highlighted-marker' : ''}`;

    ReactDOM.render(
      <StyledEventMarkerSVG
        className={iconClassNames}
        shadowed={this.options.highlighted}
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

    const accessibleName = t`Event Map Marker`;
    link.setAttribute('aria-label', accessibleName);
    return link;
  }
}
