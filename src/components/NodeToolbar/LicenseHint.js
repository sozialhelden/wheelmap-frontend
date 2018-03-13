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
          if (typeof source !== 'object') return;
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

    // translator: License hint on the place toolbar.
    const sourceCaption = t`Source:`;

    let licenseLinkOrName = license.shortName;
    if (typeof license.websiteURL === 'string') {
      licenseLinkOrName = <a href={license.websiteURL}>{license.shortName}</a>;
    }
    let sourceLinkOrName = source.name;
    if (typeof source.originWebsiteURL === 'string') {
      sourceLinkOrName = <a href={source.originWebsiteURL}>{source.name}</a>;
    }
    return (<p className={this.props.className}>
      {sourceCaption} {sourceLinkOrName} — {licenseLinkOrName}
    </p>);
  }
}


const StyledLicenseHint = styled(LicenseHint)`
  margin-top: .5em;
  font-size: 80%;
  opacity: 0.5;
`;


export default StyledLicenseHint;
