const config = {
  mapbox: {
    accessToken: 'pk.eyJ1Ijoic296aWFsaGVsZGVuIiwiYSI6IkdUY09sSmsifQ.6vkpci46vdS7m5Jeb_YTbA',
  },
  // For development, do not set REACT_APP_WHEELMAP_API_BASE_URL here, but use the proxy defined in package.json.
  // Production API key
  wheelmap: {
    apiKey: '3s8GNQvBCmwm45zro_jP',
    baseUrl: {
      clientSide: '', // use relative URL
      serverSide: 'https://wheelmap.org', // use relative URL
    },
  },
  accessibilityCloud: {
    appToken: '27be4b5216aced82122d7cf8f69e4a07',
    baseUrl: {
      cached: 'https://accessibility-cloud.freetls.fastly.net',
      uncached: 'https://www.accessibility.cloud',
    },
  },
  baseUrl: 'https://wheelmap.tech',
};

module.exports = config;
