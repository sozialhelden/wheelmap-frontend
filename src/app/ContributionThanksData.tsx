import React from 'react';

import { DataTableEntry } from './getInitialProps';
import { t } from 'ttag';

type ContributionThanksProps = {};

const ContributionThanksData: DataTableEntry<ContributionThanksProps> = {
  getHead(props) {
    return <title key="title">{t`Thank you for the contribution!`}</title>;
  },
};

export default ContributionThanksData;
