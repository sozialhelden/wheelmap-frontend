// @flow

import * as React from 'react';
import dynamic from 'next/dynamic';

import savedState, { saveState } from '../lib/savedState';
import env from '../lib/env';
import {
  getAppInitialProps,
  clientStoreAppInitialProps,
  type AppProps,
} from '../app/getInitialProps';

const DynamicApp = dynamic(import('../App'), {
  ssr: false,
});

type Props = AppProps & { buildTimeProps: AppProps, isCordovaBuild: boolean };
type State = {
  storedInitialProps: ?AppProps,
};

/// Takes care of rendering the page in the cordova environment
/// Mostly deals with setting the correct initialProps and storing them for offline usage
class CordovaMain extends React.PureComponent<Props, State> {
  state: State = {
    storedInitialProps: savedState.initialProps,
  };
  constructor(props: Props) {
    super(props);

    // inject the build time data into the initial props
    const { translations, ...remainingBuildTimeProps } = props.buildTimeProps;
    clientStoreAppInitialProps(remainingBuildTimeProps);

    // if we have stored props, use these to override the build time props
    if (savedState.initialProps) {
      const { translations, ...remainingInitialProps } = savedState.initialProps;
      clientStoreAppInitialProps(remainingInitialProps);
    }
  }

  componentDidMount() {
    const userAgentString = window.navigator.userAgent;
    const languages = [window.navigator.language]
      .concat(window.navigator.languages || [])
      .filter(Boolean);

    const hostName = env.public.cordovaHostname;

    // try downloading new initial props after first mount
    getAppInitialProps({ userAgentString, hostName, languages }, false, false)
      .then(this.onInitialPropsFetched)
      .catch(e => {
        console.warn('Failed loading new initial props from server, staying with build props.', e);
      });
  }

  onInitialPropsFetched = (reloadedInitialProps: AppProps) => {
    console.log('Received new initial props from server.');
    clientStoreAppInitialProps(reloadedInitialProps);
    saveState({
      initialProps: JSON.stringify(reloadedInitialProps),
    });
    this.setState({
      storedInitialProps: reloadedInitialProps,
    });
  };

  render() {
    const { isCordovaBuild, buildTimeProps, ...props } = this.props;
    const { storedInitialProps } = this.state;

    // do not pre-render this at build time, it is only needed in the real browser
    return <DynamicApp {...buildTimeProps} {...storedInitialProps} {...props} />;
  }
}

export default CordovaMain;
