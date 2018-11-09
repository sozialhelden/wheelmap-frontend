// @flow

import * as React from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import savedState, { saveState } from '../lib/savedState';
import env from '../lib/env';
import { getAppInitialProps, storeAppInitialProps, type AppProps } from '../app/getInitialProps';
import {
  addTranslationsToTTag,
  getAvailableTranslationsByPreference,
  getBrowserLocaleStrings,
} from '../lib/i18n';

import Categories from '../lib/Categories';

import allTranslations from '../lib/translations.json';

// dynamically load app only after cordova is ready
const DynamicApp = dynamic(import('../App'), {
  ssr: false,
});

const isBrowser = typeof window !== 'undefined';
const isBuilding = !isBrowser;

const debugCordovaTest = isBrowser && !navigator.userAgent.match(/(iOS|Android)/i);

if (debugCordovaTest) {
  console.warn('EMULATING CORDOVA ON DESKTOP - behavior in Cordova will differ');
}

type Props = AppProps & { buildTimeProps: AppProps, isCordovaBuild: boolean };

type State = {
  buildTimeProps: $Shape<AppProps>,
  storedInitialProps: ?$Shape<AppProps>,
  isDeviceReady: boolean,
  expectedPromise: ?Promise<AppProps>,
};

/// Takes care of rendering the page in the cordova environment
/// Mostly deals with setting the correct initialProps and storing them for offline usage
class CordovaMain extends React.PureComponent<Props, State> {
  state: State = {
    buildTimeProps: {},
    storedInitialProps: savedState.initialProps,
    isDeviceReady: false,
    expectedPromise: null,
  };

  constructor(props: Props) {
    super(props);

    // always apply
    if (isBrowser) {
      const localeStrings = getBrowserLocaleStrings();
      // TODO: Make locale overridable via parameter
      const translations = getAvailableTranslationsByPreference(allTranslations, localeStrings);
      addTranslationsToTTag(translations);
      storeAppInitialProps({ translations }, isBuilding);
    }

    // inject the build time data into the initial props, these are only available on the initial route
    if (props.buildTimeProps) {
      const { translations, ...remainingBuildTimeProps } = props.buildTimeProps;
      this.state.buildTimeProps = remainingBuildTimeProps;
      storeAppInitialProps(remainingBuildTimeProps, isBuilding);
    }

    // if we have stored props, use these to override the build time props
    if (savedState.initialProps) {
      storeAppInitialProps(savedState.initialProps, isBuilding);
    }
  }

  componentDidMount() {
    // device ready will always be invoked, there is no way to miss this event
    document.addEventListener(
      'deviceready',
      () => {
        this.fetchInitialProps();
        this.setState({ isDeviceReady: true });
      },
      false
    );

    if (debugCordovaTest) {
      document.dispatchEvent(new Event('deviceready'));
    }
  }

  fetchInitialProps() {
    const userAgentString = window.navigator.userAgent;
    const localeStrings = getBrowserLocaleStrings();
    const hostName = env.public.cordovaHostname;

    // try downloading new initial props after first mount
    const queryProps: any = { userAgentString, hostName, localeStrings };
    if (debugCordovaTest) {
      queryProps.disableWheelmapSource = 'true';
    }
    const expectedPromise = getAppInitialProps(queryProps, false, false);

    this.setState({ expectedPromise }, () => {
      expectedPromise
        .then(results => this.onInitialPropsFetched(expectedPromise, results))
        .catch(e => {
          console.warn(
            'Failed loading new initial props from server, staying with build props.',
            e
          );
        });
    });
  }

  onInitialPropsFetched = (promise: Promise<AppProps>, reloadedInitialProps: AppProps) => {
    if (promise !== this.state.expectedPromise) {
      return;
    }

    console.log('Received new initial props from server.', reloadedInitialProps);
    // strip translations, no need to cache them
    const { rawCategoryLists, clientSideConfiguration } = reloadedInitialProps;

    storeAppInitialProps({ rawCategoryLists, clientSideConfiguration }, isBuilding);
    this.setState({
      storedInitialProps: { rawCategoryLists, clientSideConfiguration },
    });
    saveState({
      'initialProps.rawCategoryLists': JSON.stringify(rawCategoryLists),
      'initialProps.clientSideConfiguration': JSON.stringify(clientSideConfiguration),
    });
  };

  render() {
    const { isCordovaBuild, ...props } = this.props;
    const { buildTimeProps, storedInitialProps, isDeviceReady } = this.state;

    // build lookup table
    const bestAvailableRawCategoryLists =
      props.rawCategoryLists ||
      (storedInitialProps ? storedInitialProps.rawCategoryLists : null) ||
      buildTimeProps.rawCategoryLists;

    const categories = Categories.generateLookupTables(bestAvailableRawCategoryLists);

    // do not pre-render this at build time, it is only needed in the real browser
    return (
      <React.Fragment>
        <Head>
          <script src="cordova.js" />
        </Head>
        {isDeviceReady && (
          <DynamicApp
            {...buildTimeProps}
            {...storedInitialProps}
            {...props}
            categories={categories}
          />
        )}
      </React.Fragment>
    );
  }
}

export default CordovaMain;
