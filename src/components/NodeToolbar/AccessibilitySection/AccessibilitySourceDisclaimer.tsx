import styled from 'styled-components';
import * as React from 'react';
import { PlaceProperties } from '@sozialhelden/a11yjson';
import { dataSourceCache } from '../../../lib/cache/DataSourceCache';
import { LocalizedString } from '../../../lib/i18n/LocalizedString';
import { translatedStringFromObject } from '../../../lib/i18n/translatedStringFromObject';

type Props = {
  properties: PlaceProperties,
  className?: string,
  appToken: string,
};

type State = {
  extraInfo: LocalizedString | null,
};

const defaultState = { extraInfo: null };

class AccessibilitySourceDisclaimer extends React.Component<Props, State> {
  props: Props;

  state = defaultState;

  UNSAFE_componentWillReceiveProps(newProps: Props) {
    if (!newProps.properties || !newProps.properties.sourceId) {
      this.setState(defaultState);
      return;
    }

    dataSourceCache.getDataSourceWithId(newProps.properties.sourceId, newProps.appToken).then(
      (source) => {
        const string = source.additionalAccessibilityInformation
          || source.translations?.additionalAccessibilityInformation;
        this.setState({
          extraInfo: string ? translatedStringFromObject(string) : null,
        });
      },
      () => {
        this.setState(defaultState);
      },
    );
  }

  render() {
    const { extraInfo } = this.state;
    if (!extraInfo) return null;
    return <p className={`${this.props.className || ''} extra-info`}>{extraInfo}</p>;
  }
}

const StyledAccessibilitySourceDisclaimer = styled(AccessibilitySourceDisclaimer)`
  opacity: 0.7;
  padding-bottom: 0.5rem;
`;

export default StyledAccessibilitySourceDisclaimer;
