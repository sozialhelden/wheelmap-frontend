// @flow

import * as React from 'react';
import styled from 'styled-components';

import type { Feature } from '../../../lib/Feature';
import type { Category } from '../../../lib/Categories';

import ShareButtons from './ShareButtons';
import ExternalLinks from './ExternalLinks';
import PlaceAddress from './PlaceAddress';


type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  category: ?Category,
  parentCategory: ?Category,
};


export default class IconButtonList extends React.Component<Props> {
  render() {
    return (
      <React.Fragment>
        <PlaceAddress {...this.props} />
        <ExternalLinks {...this.props} />
        <ShareButtons {...this.props} />
      </React.Fragment>
    );
  }
}
