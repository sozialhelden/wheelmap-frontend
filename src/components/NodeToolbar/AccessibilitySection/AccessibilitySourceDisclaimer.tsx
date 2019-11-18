import styled from 'styled-components';
import * as React from 'react';
import { dataSourceCache } from '../../../lib/cache/DataSourceCache';
import { AccessibilityCloudProperties } from '../../../lib/Feature';

type Props = {
  properties: AccessibilityCloudProperties, // eslint-disable-line react/no-unused-prop-types
  className?: string,
  appToken: string,
};

type State = {
  extraInfo: string | null,
};

const defaultState = { extraInfo: null };

class AccessibilitySourceDisclaimer extends React.Component<Props, State> {
  props: Props;
  state = defaultState;

  componentWillReceiveProps(newProps: Props) {
    if (!newProps.properties || !newProps.properties.sourceId) {
      this.setState(defaultState);
      return;
    }
    dataSourceCache.getDataSourceWithId(newProps.properties.sourceId, newProps.appToken).then(
      source => {
        this.setState({ extraInfo: source.additionalAccessibilityInformation });
      },
      () => {
        this.setState(defaultState);
      }
    );
  }

  render() {
    const extraInfo = this.state.extraInfo;
    if (!extraInfo) return null;
    return <p className={`${this.props.className || ''} extra-info`}>{extraInfo}</p>;
  }
}

const StyledAccessibilitySourceDisclaimer = styled(AccessibilitySourceDisclaimer)`
  font-size: 80%;
  opacity: 0.5;
`;

export default StyledAccessibilitySourceDisclaimer;
