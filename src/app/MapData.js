// @flow

import React from 'react';

import { type DataTableEntry } from './getInitialProps';
import { getProductTitle } from '../lib/ClientSideConfiguration';

type MapProps = {};

const MapData: DataTableEntry<MapProps> = {
  getHead(props) {
    return <title key="title">{getProductTitle(props.clientSideConfiguration)}</title>;
  },
};

export default MapData;
