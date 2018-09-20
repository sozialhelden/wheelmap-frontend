// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';

import { type Feature, sourceIdsForFeature } from '../../lib/Feature';
import LicenseHint from './LicenseHint';
import { type DataSource } from '../../lib/cache/DataSourceCache';
import { type License } from '../../lib/cache/LicenseCache';

type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  licenses: License[],
  sources: DataSource[],
  equipmentInfoId: ?string,
  history: RouterHistory,
  className: string,
};

function renderLicenseHint(sourceId: string, sources: DataSource[], licenses: License[]) {
  if (!sources || !licenses) {
    return null;
  }

  const source = sources.find(s => s._id === sourceId);

  if (!source || !source.licenseId) {
    return null;
  }

  const license = licenses.find(l => l._id === source.licenseId);
  return <LicenseHint key={sourceId} source={source} license={license} />;
}

function UnstyledSourceList(props: Props) {
  const sourceIds = sourceIdsForFeature(props.feature);
  // translator: Prefix for the sources on the PoI details panel
  const prefixCaption = t`Source:`;

  return (
    <section className={props.className}>
      {sourceIds.length ? `${prefixCaption} ` : null}
      <ul>
        {sourceIds.map(sourceId => renderLicenseHint(sourceId, props.sources, props.licenses))}
      </ul>
    </section>
  );
}

const SourceList = styled(UnstyledSourceList)`
  margin: .5rem 0;

  font-size: 80%;
  opacity: 0.5;

  ul, li {
    display: inline;
    margin: 0;
    padding: 0;
  }

  li + li:before {
    content: ', ';
  }
}`;

export default SourceList;
