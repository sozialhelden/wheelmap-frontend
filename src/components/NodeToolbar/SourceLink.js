// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { dataSourceCache } from '../../lib/cache/DataSourceCache';
import type { AccessibilityCloudProperties } from '../../lib/Feature';
import colors from '../../lib/colors';
import ChevronRight from './ChevronRight';


type Props = {
  properties: AccessibilityCloudProperties,
  className: string,
};

type State = {
  sourceName: ?string;
};

const defaultState = { sourceName: null };

class SourceLink extends Component<void, Props, State> {
  props: Props;
  state = defaultState;

  componentWillReceiveProps(newProps: Props) {
    if (!newProps.properties || !newProps.properties.sourceId) {
      this.setState(defaultState);
      return;
    }
    dataSourceCache
      .getDataSourceWithId(newProps.properties.sourceId)
      .then(
        (source) => { this.setState({ sourceName: source.name }); },
        () => { this.setState(defaultState); },
      );
  }

  render() {
    const { properties, className } = this.props;
    const infoPageUrl = properties.infoPageUrl;
    if (!infoPageUrl) return null;
    const sourceName = this.state.sourceName;
    return (<a href={infoPageUrl} className={`${className} link-button`}>
      {sourceName ? `on ${sourceName}` : 'Details'} <ChevronRight color={colors.linkColor} />
    </a>);
  }
}


const StyledSourceLink = styled(SourceLink)`
  margin-top: .5em;
  text-align: right;
  .chevron-right {
    vertical-align: bottom;
    height: 18px;
    width: 7px;
    min-width: 7px;
    margin: 0;
  }
`;


export default StyledSourceLink;
