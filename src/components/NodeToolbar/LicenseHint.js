// @flow

import { t } from 'c-3po';
import styled from 'styled-components';
import * as React from 'react';
import { dataSourceCache } from '../../lib/cache/DataSourceCache';
import { licenseCache } from '../../lib/cache/LicenseCache';

type Props = {
  sourceId: ?string,
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
    if (!newProps || typeof newProps.sourceId !== 'string') {
      this.setState(defaultState);
      return;
    }

    dataSourceCache
      .getDataSourceWithId(newProps.sourceId)
      .then(
        (source) => {
          if (!source) return;
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

    let licenseLinkOrName = license.shortName;
    if (typeof license.websiteURL === 'string') {
      licenseLinkOrName = license.shortName === '?' ? null : <a href={license.websiteURL}>{license.shortName}</a>;
    }
    let sourceLinkOrName = source.name;
    if (typeof source.originWebsiteURL === 'string') {
      sourceLinkOrName = <a href={source.originWebsiteURL}>{source.name}</a>;
    }
    return (<li className={this.props.className}>
      {sourceLinkOrName} {licenseLinkOrName ? <span>({licenseLinkOrName})</span> : null}
    </li>);
  }
}


const StyledLicenseHint = styled(LicenseHint)`

`;


export default StyledLicenseHint;
