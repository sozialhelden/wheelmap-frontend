// @flow

import { t } from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import { dataSourceCache } from '../../lib/cache/DataSourceCache';
import { licenseCache } from '../../lib/cache/LicenseCache';
import type { AccessibilityCloudProperties } from '../../lib/Feature';

type Props = {
  properties: AccessibilityCloudProperties,
  className: string,
};

type State = {
  license: ?any,
  source: ?any,
};

const defaultState = { license: null, source: null };

class LicenseHint extends React.Component<Props, State> {
  props: Props;
  state = defaultState;

  componentWillReceiveProps(newProps: Props) {
    if (!newProps.properties || typeof newProps.properties.sourceId !== 'string') {
      this.setState(defaultState);
      return;
    }

    dataSourceCache
      .getDataSourceWithId(newProps.properties.sourceId)
      .then(
        (source) => {
          this.setState({ source });
          if (typeof source.licenseId === 'string') {
            return licenseCache.getLicenseWithId(source.licenseId);
          }
          return null;
        },
        () => { this.setState(defaultState); },
      ).then(
        license => this.setState({ license }),
        () => { this.setState(defaultState); },
      );
  }

  render() {
    const source = this.state.source;
    if (!source) return null;
    const license = this.state.license;
    if (!license) return null;
    if (typeof license.websiteURL !== 'string') return null;

    // translator: License hint on the place toolbar.
    const sourceCaption = t`Source:`;

    return (<p className={this.props.className}>
      {sourceCaption} {source.name} —
      <a href={license.websiteURL}>{license.shortName}</a>
    </p>);
  }
}


const StyledLicenseHint = styled(LicenseHint)`
  margin-top: .5em;
  font-size: 80%;
  opacity: 0.5;
`;


export default StyledLicenseHint;
