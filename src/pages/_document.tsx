import Document, { DocumentContext, DocumentInitialProps, Head, Html, Main, NextScript } from "next/document";
import * as React from 'react';
import { ServerStyleSheet } from 'styled-components';
import env from '../lib/env';

export default class MyDocument extends Document<any> {
  static getInitialProps({ renderPage, ...ctx }: DocumentContext) {
    const sheet = new ServerStyleSheet();

    // Hacky way to get the locale used when rendering the page.
    let locale = 'en-us';

    // TODO: Collect fetch jobs executed as a side effect from useSWRWithPrefetch here.
    // All fetch requests are supposed to be collected like in styled-components SSR,
    // so we can hand the preloaded data over to the client.

    const page = renderPage(App => props => {
      locale = props['locale'];
      return sheet.collectStyles(<App {...props} />);
    });

    const styleTags = sheet.getStyleElement();
    const extendedProps = { ...page, styleTags, locale } as any as DocumentInitialProps;
    return Promise.resolve(extendedProps);
  }

  render() {
    const { locale } = this.props;

    return (
      <Html lang={locale}>
        <Head>
          <meta charSet="utf-8" key="charSet" />
          <meta
            httpEquiv="Content-Security-Policy"
            content={`
              default-src
                'self'
                ws:
                data: 
                blob:
                'self'
                'unsafe-eval'
                'unsafe-inline'
                https://sozialhelden.de
                https://service.sozialhelden.de
                https://photon.komoot.io
                https://api.mapbox.com
                https://api.tiles.mapbox.com
                https://events.mapbox.com
                ${env.REACT_APP_LEGACY_API_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || ''}
                ${env.REACT_APP_ELASTIC_APM_SERVER_URL || ''}
                ${env.REACT_APP_ALLOW_ADDITIONAL_DATA_URLS || ''};
              style-src
                'self'
                https://api.tiles.mapbox.com
                'unsafe-inline';
              frame-src
                'self';
              media-src
                'self';
              img-src
                'self'
                data:
                blob:
                https://accessibility-cloud-uploads.s3.amazonaws.com
                https://service.sozialhelden.de
                https://api.mapbox.com
                https://asset0.wheelmap.org
                https://asset1.wheelmap.org
                https://asset2.wheelmap.org
                https://asset3.wheelmap.org
                https://asset4.wheelmap.org
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || ''}
                ${env.REACT_APP_ALLOW_ADDITIONAL_IMAGE_URLS || ''};
            `}
          />

          {/* Google Bots */}
          <meta content="follow index" name="robots" />

          {/* iOS link to "native" app and configuration for web app */}
          <meta name="apple-mobile-web-app-title" content="Wheelmap" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

          <link rel="apple-touch-icon" href="/images/wheely_big.jpg" />
          <link rel="apple-touch-icon" sizes="76x76" href="/images/wheely_big.jpg" />
          <link rel="apple-touch-icon" sizes="120x120" href="/images/wheely_big.jpg" />
          <link rel="apple-touch-icon" sizes="152x152" href="/images/wheely_big.jpg" />

          {this.props.styleTags}
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{ __html: `
              // window.pkBaseURL = "/t/";
              window.pkBaseURL = "https://service.sozialhelden.de/";
              window._paq = [
                ['setTrackerUrl', pkBaseURL + "pwproxy.php"],
                ['setSiteId', '8'],
                ['disableCookies'],
              ];
          `}} />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `document.write(unescape("%3Cscript src='" + pkBaseURL + "pwproxy.php' async type='text/javascript'%3E%3C/script%3E"));`}}
          />
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
                function trackNativeAppStats() {
                  try {
                    var isNative = !!window.navigator.userAgent.match(/AllyApp/);

                    window._paq.push([
                      'setCustomDimension',
                      1, // Native app used
                      isNative ? 'Native Mobile App' : 'Desktop Browser'
                    ]);

                    if (!isNative) {
                      return;
                    }

                    var nativeAppVersionMatch = window.navigator.userAgent.match(
                      /AllyApp\\/(?:([^ ]+)(?: \\(([^)]+)\\))?)/
                    );
                    if (!nativeAppVersionMatch[1]) {
                      return;
                    }

                    window._paq.push([
                      'setCustomDimension',
                      2, // Native app version
                      nativeAppVersionMatch[1]
                    ]);

                    if (!nativeAppVersionMatch[2]) {
                      return;
                    }

                    window._paq.push([
                      'setCustomDimension',
                      3, // Native app OS
                      nativeAppVersionMatch[2],
                    ]);
                  } catch (e) {
                    console.log('Error: Could not track native app usage:', e);
                  }
                }

                try {

                  
                  
                  // var piwikTracker = Piwik.getTracker(pkBaseURL + "pwproxy.php", 8);
                  // piwikTracker.disableCookies();
                  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
                  trackNativeAppStats();
                  window._paq.push(['trackPageView']);
                  window._paq.push(['enableLinkTracking']);
                  window._paq.push(['enableHeartBeatTimer']);
                } catch( err ) {
                  console.log('Error loading Piwik:', err);
                }
              `
            }}
          ></script>
          <script src="/clientEnv.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
