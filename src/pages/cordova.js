// @flow

import * as React from 'react';
import dynamic from 'next/dynamic';
import { clientStoreAppInitialProps } from '../app/getInitialProps';

const DynamicApp = dynamic(import('../App'), {
  ssr: false,
});

type Props = any;
type State = {};

class CordovaMain extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    // inject the build time data into the initial props for future rerouting
    clientStoreAppInitialProps(props.buildTimeProps);
  }

  render() {
    const { isCordovaBuild, buildTimeProps, ...props } = this.props;

    // do not pre-render this at build time, only needed at startup
    return <DynamicApp {...buildTimeProps} {...props} />;
  }
}

export default CordovaMain;
