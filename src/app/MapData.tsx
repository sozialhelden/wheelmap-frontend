import React from 'react';

import { DataTableEntry } from './getInitialProps';
import { getProductTitle } from '../lib/ClientSideConfiguration';

type MapProps = {};

const MapData: DataTableEntry<MapProps> = {
  getHead(props) {
    return <title key="title">{getProductTitle(props.app.clientSideConfiguration)}</title>;
  },
};

export default MapData;
