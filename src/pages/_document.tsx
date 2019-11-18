import Document, { Head, Html, Main, NextScript } from 'next/document';
import * as React from 'react';
import { ServerStyleSheet } from 'styled-components';
import env from '../lib/env';

export default class MyDocument extends Document<any> {
  static getInitialProps({ renderPage, ...ctx }: any) {
    const sheet = new ServerStyleSheet();

    // Hacky way to get the locale used when rendering the page.
    let locale;

    const page = renderPage(App => props => {
      locale = props.locale;
      return sheet.collectStyles(<App {...props} />);
    });

    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags, locale };
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
                ws:
                data:
                'self'
                'unsafe-eval'
                'unsafe-inline'
                https://www.google-analytics.com
                https://www.googletagmanager.com
                https://ssl.gstatic.com
                https://photon.komoot.de
                https://sozialhelden.matomo.cloud
                https://cdn.matomo.cloud
                http://cdn.matomo.cloud

                ${env.REACT_APP_LEGACY_API_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL || ''}
                ${env.REACT_APP_ELASTIC_APM_SERVER_URL || ''}
                ${env.REACT_APP_ALLOW_ADDITIONAL_DATA_URLS || ''};

                style-src
                'self'
                'unsafe-inline';
              frame-src
                'self';
              media-src
                'self';
              img-src
                'self'
                data:
                https://accessibility-cloud-uploads.s3.amazonaws.com
                https://sozialhelden.matomo.cloud
                https://api.mapbox.com
                https://asset0.wheelmap.org
                https://asset1.wheelmap.org
                https://www.googletagmanager.com
                https://www.google-analytics.com
                https://asset2.wheelmap.org
                https://asset3.wheelmap.org
                https://asset4.wheelmap.org
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || ''}
                ${env.REACT_APP_ACCESSIBILITY_APPS_BASE_URL || ''}
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
            dangerouslySetInnerHTML={{
              __html: `
                var _paq = window._paq || [];
                /* tracker methods like "setCustomDimension" should be called before "trackPageView" */

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

                trackNativeAppStats();
                _paq.push(['trackPageView']);
                _paq.push(['enableLinkTracking']);
                _paq.push(['enableHeartBeatTimer']);

                (function() {
                  var u="https://sozialhelden.matomo.cloud/";
                  _paq.push(['setTrackerUrl', u+'matomo.php']);
                  _paq.push(['setSiteId', '1']);
                  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                  g.type='text/javascript'; g.async=true; g.defer=true; g.src='//cdn.matomo.cloud/sozialhelden.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
                })();`,
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
