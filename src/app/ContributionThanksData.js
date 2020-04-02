// @flow

import React from 'react';

import { type DataTableEntry } from './getInitialProps';
import { t } from 'ttag';

type ContributionThanksProps = {};

const ContributionThanksData: DataTableEntry<ContributionThanksProps> = {
  async getInitialRouteProps(query, renderContextPromise, isServer) {
    const featureId = query.id;
    return {
      featureId,
    };
  },

  getHead(props) {
    return <title key="title">{t`Thank you for the contribution!`}</title>;
  },
};

export default ContributionThanksData;
