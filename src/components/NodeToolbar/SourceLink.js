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

const defaultState: State = { sourceName: null };

class SourceLink extends Component<Props, State> {
  props: Props;
  state: State = defaultState;

  fetchSource(props: Props) {
    if (!props.properties || !props.properties.sourceId) {
      this.setState(defaultState);
      return;
    }
    dataSourceCache
      .getDataSourceWithId(props.properties.sourceId)
      .then(
        (source) => { this.setState({ sourceName: source.name }); },
        () => { this.setState(defaultState); },
      );
  }

  componentDidMount() {
    this.fetchSource(this.props);
  }

  componentWillReceiveProps(newProps: Props) {
    this.fetchSource(newProps);
  }

  render() {
    const { properties, className } = this.props;
    const infoPageUrl = properties.infoPageUrl;
    if (!infoPageUrl) return null;
    const sourceName = this.state.sourceName;
    return (<a href={infoPageUrl} className={`${className} link-button`}>
      {sourceName ? `View this place on ${sourceName}` : 'Details'} <ChevronRight color={colors.linkColor} />
    </a>);
  }
}


const StyledSourceLink = styled(SourceLink)`
  margin-top: .5em;
  .chevron-right {
    vertical-align: bottom;
    height: 18px;
    width: 7px;
    min-width: 7px;
    margin: 0;
  }
`;


export default StyledSourceLink;
