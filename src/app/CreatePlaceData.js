// @flow

import React from 'react';

import { type DataTableEntry } from './getInitialProps';
import { t } from 'ttag';

type CreatePlaceProps = {};

const CreatePlaceData: DataTableEntry<CreatePlaceProps> = {
  getHead(props) {
    return <title key="title">{t`Add a new place`}</title>;
  },
};

export default CreatePlaceData;
