// @flow

import styled from 'styled-components';
import * as React from 'react';
import { dataSourceCache } from '../../lib/cache/DataSourceCache';
import type { AccessibilityCloudProperties } from '../../lib/Feature';

type Props = {
  properties: AccessibilityCloudProperties, // eslint-disable-line react/no-unused-prop-types
  className: string,
};

type State = {
  extraInfo: ?string;
};

const defaultState = { extraInfo: null };

class AccessibilityExtraInfo extends React.Component<Props, State> {
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
        (source) => {
          this.setState({ extraInfo: source.additionalAccessibilityInformation });
        },
        () => { this.setState(defaultState); },
      );
  }

  render() {
    const extraInfo = this.state.extraInfo;
    if (!extraInfo) return null;
    return <p className={`${this.props.className} extra-info`}>{extraInfo}</p>;
  }
}


const StyledAccessibilityExtraInfo = styled(AccessibilityExtraInfo)`
  font-size: 80%;
  opacity: 0.5;
`;


export default StyledAccessibilityExtraInfo;
