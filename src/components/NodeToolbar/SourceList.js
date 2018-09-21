// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import type { RouterHistory } from 'react-router-dom';

import { type Feature } from '../../lib/Feature';
import LicenseHint from './LicenseHint';
import { type SourceWithLicense } from '../../app/PlaceDetailsProps';

type Props = {
  feature: ?Feature,
  featureId: ?string | number,
  sources: SourceWithLicense[],
  equipmentInfoId: ?string,
  history: RouterHistory,
  className: string,
};

function renderLicenseHint(sourceWithLicense: SourceWithLicense) {
  return (
    <LicenseHint
      key={sourceWithLicense.source._id}
      source={sourceWithLicense.source}
      license={sourceWithLicense.license}
    />
  );
}

function UnstyledSourceList(props: Props) {
  const { sources } = props;

  // translator: Prefix for the sources on the PoI details panel
  const prefixCaption = t`Source:`;

  return (
    <section className={props.className}>
      {sources.length ? `${prefixCaption} ` : null}
      <ul>{sources.map(sourceWithLicense => renderLicenseHint(sourceWithLicense))}</ul>
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
