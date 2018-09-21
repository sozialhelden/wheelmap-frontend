// @flow

import React from 'react';
import Head from 'next/head';

import { type DataTableEntry } from './getInitialProps';
import { getProductTitle } from '../lib/ClientSideConfiguration';

type MapProps = {};

const MapData: DataTableEntry<MapProps> = {
  getHead(props) {
    return (
      <Head>
        <title>{getProductTitle(props.clientSideConfiguration)}</title>
      </Head>
    );
  },
};

export default MapData;
