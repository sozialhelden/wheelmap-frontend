// @flow

import * as React from 'react';
import dynamic from 'next/dynamic';

import savedState, { saveState } from '../lib/savedState';
import env from '../lib/env';
import { getInitialAppProps, storeInitialAppProps, type AppProps } from '../app/getInitialProps';
import {
  addTranslationsToTTag,
  getAvailableTranslationsByPreference,
  getBrowserLocaleStrings,
} from '../lib/i18n';

import Categories from '../lib/Categories';

import allTranslations from '../lib/translations.json';
import { type RouterHistory } from '../lib/RouterHistory';
import MapLoading from '../components/Map/MapLoading';
import { activateCordovaDebugMode, isCordovaDebugMode } from '../lib/isCordova';

// dynamically load app only after cordova is ready
const DynamicApp = dynamic(import('../App'), {
  ssr: false,
  loading: () => <MapLoading />,
});

const isBrowser = typeof window !== 'undefined';
const isBuilding = !isBrowser;

const shouldActivateCordovaDebugMode =
  isBrowser && !navigator.userAgent.match(/(iOS|iPhone|Android)/i);
if (shouldActivateCordovaDebugMode) {
  activateCordovaDebugMode();
}

type Props = {
  buildTimeProps: AppProps,
  appProps: AppProps,
  routeName: string,
  routerHistory: RouterHistory,
  isCordovaBuild: boolean,
  getRenderProps: (routeName: string, props: AppProps, isServer: boolean) => any,
};

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
      const overrideLocaleString = props.appProps && props.appProps.preferredLocaleString;
      const localeStrings = getBrowserLocaleStrings();
      // Make locale overridable via parameter
      const translations = getAvailableTranslationsByPreference(
        allTranslations,
        localeStrings,
        overrideLocaleString
      );
      addTranslationsToTTag(translations);
      storeInitialAppProps({ translations }, isBuilding);
    }

    // inject the build time data into the initial props, these are only available on the initial route
    if (props.buildTimeProps) {
      const { translations, ...remainingBuildTimeProps } = props.buildTimeProps;
      this.state.buildTimeProps = remainingBuildTimeProps;
      storeInitialAppProps(remainingBuildTimeProps, isBuilding);
    }

    // if we have stored props, use these to override the build time props
    if (savedState.initialProps) {
      storeInitialAppProps(savedState.initialProps, isBuilding);
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

    // device ready is not fired
    if (isCordovaDebugMode()) {
      document.dispatchEvent(new Event('deviceready'));
    }
  }

  fetchInitialProps() {
    const userAgentString = window.navigator.userAgent;
    const localeStrings = getBrowserLocaleStrings();
    const hostName = env.public.cordovaHostname;

    // try downloading new initial props after first mount
    const queryProps: any = { userAgentString, hostName, localeStrings };
    // cors checks are active & no proxy is running
    if (isCordovaDebugMode()) {
      queryProps.disableWheelmapSource = 'true';
    }
    const expectedPromise = getInitialAppProps(queryProps, false, false);

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

    storeInitialAppProps({ rawCategoryLists, clientSideConfiguration }, isBuilding);
    this.setState({
      storedInitialProps: { rawCategoryLists, clientSideConfiguration },
    });
    saveState({
      'initialProps.rawCategoryLists': JSON.stringify(rawCategoryLists),
      'initialProps.clientSideConfiguration': JSON.stringify(clientSideConfiguration),
    });
  };

  render() {
    const { getRenderProps, appProps, routerHistory, routeName } = this.props;
    const { buildTimeProps, storedInitialProps, isDeviceReady } = this.state;

    if (!isDeviceReady) {
      return <MapLoading />;
    }

    // build lookup table
    const bestAvailableRawCategoryLists =
      (appProps ? appProps.rawCategoryLists : null) ||
      (storedInitialProps ? storedInitialProps.rawCategoryLists : null) ||
      buildTimeProps.rawCategoryLists;

    const categories = Categories.generateLookupTables(bestAvailableRawCategoryLists);
    const combinedAppProps = { ...buildTimeProps, ...storedInitialProps, ...appProps, categories };
    const renderProps = getRenderProps(routeName, combinedAppProps, false);

    // do not pre-render this at build time, it is only needed in the real browser
    return <DynamicApp {...renderProps} routerHistory={routerHistory} routeName={routeName} />;
  }
}

export default CordovaMain;
