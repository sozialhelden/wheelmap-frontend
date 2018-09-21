// @flow

import { type Feature, type WheelmapLightweightFeature } from '../lib/Feature';

import { type DataSource } from '../lib/cache/DataSourceCache';
import { type License } from '../lib/cache/LicenseCache';

// this is in its own file, to prevent circular dependencies
export type PlaceDetailsProps = {
  // preloaded feature, if it exists
  lightweightFeature: ?WheelmapLightweightFeature,
  feature: ?Feature,
  featureId: ?(string | number),
  sources?: DataSource[],
  licenses?: License[],
};
