import { loadGlobalEnvironment } from '@sozialhelden/twelve-factor-dotenv';

const envKeys = {
  REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN: true,
  REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL: true,
  REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL: true,
  REACT_APP_ALLOW_ADDITIONAL_DATA_URLS: true,
  REACT_APP_ALLOW_ADDITIONAL_IMAGE_URLS: true,
  REACT_APP_AWS_S3_BUCKET_NAME: true,
  REACT_APP_MAPBOX_GL_ACCESS_TOKEN: true,
  REACT_APP_OSM_API_LEGACY_BASE_URL: true,
  REACT_APP_OSM_API_TILE_BACKEND_URL_LEGACY: true,
  REACT_APP_WHEELMAP_API_KEY: true,
};

export function checkEnv() {
  for (const key of Object.keys(envKeys)) {
    if (!process.env[key]) {
      console.error(`Warning: ${key} not set, cannot run app.`);
    }
  }
}

type Environment = {
  npm_package_version: string;
  PUBLIC_URL: string;
  BASE_URL: string;
  REACT_APP_ACCESSIBILITY_CLOUD_APP_TOKEN: string;
  REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL: string;
  REACT_APP_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL: string;
  REACT_APP_ALLOW_ADDITIONAL_DATA_URLS: string;
  REACT_APP_ALLOW_ADDITIONAL_IMAGE_URLS: string;
  REACT_APP_AWS_S3_BUCKET_NAME: string;
  REACT_APP_MAPBOX_GL_ACCESS_TOKEN: string;
  REACT_APP_OSM_API_LEGACY_BASE_URL: string;
  REACT_APP_OSM_API_TILE_BACKEND_URL_LEGACY: string;
  REACT_APP_WHEELMAP_API_KEY: string;
};

const env: Environment = loadGlobalEnvironment();

export default env;
