// @flow

import { type Feature, type WheelmapLightweightFeature } from '../lib/Feature';

import { type DataSource } from '../lib/cache/DataSourceCache';
import { type License } from '../lib/cache/LicenseCache';
import { type EquipmentInfo } from '../lib/EquipmentInfo';

export type SourceWithLicense = {
  source: DataSource,
  license: ?License,
};

export type PotentialPromise<T> = T | Promise<T>;

function getDataIfAlreadyResolved<T>(potentialPromise: PotentialPromise<T>): T | null {
  if (potentialPromise instanceof Promise) {
    return null;
  }

  return potentialPromise;
}

function getDataPromise<T>(potentialPromise: PotentialPromise<T>): Promise<T> {
  if (potentialPromise instanceof Promise) {
    return potentialPromise;
  }
  return Promise.resolve(potentialPromise);
}

// this is in its own file, to prevent circular dependencies
export type PlaceDetailsProps = {
  // preloaded feature, if it exists
  lightweightFeature: ?WheelmapLightweightFeature,
  // full feature, sync on server, async on client
  feature: PotentialPromise<?Feature>,
  // the feature id
  featureId: ?(string | number),
  // all sources for this feature with a license attached
  sources: PotentialPromise<SourceWithLicense[]>,
  // the equimentInfo id
  equipmentInfoId: ?string,
  // the equimentInfo
  equipmentInfo: ?PotentialPromise<EquipmentInfo>,
};

export type ResolvedPlaceDetailsProps = {
  // preloaded feature, if it exists
  lightweightFeature: ?WheelmapLightweightFeature,
  // full feature, sync on server, async on client
  feature: ?Feature,
  // the feature id
  featureId: ?(string | number),
  // all sources for this feature with a license attached
  sources: SourceWithLicense[],
  // the equimentInfo id
  equipmentInfoId: ?string,
  // the equimentInfo
  equipmentInfo: ?EquipmentInfo,
};

export function getPlaceDetailsIfAlreadyResolved(
  props: PlaceDetailsProps
): ResolvedPlaceDetailsProps | null {
  const resolvedFeature = getDataIfAlreadyResolved(props.feature);
  const resolvedSources = getDataIfAlreadyResolved(props.sources);
  const resolvedEquimentInfo = props.equipmentInfo
    ? getDataIfAlreadyResolved(props.equipmentInfo)
    : null;

  if (!resolvedSources || !resolvedFeature) {
    return null;
  }

  return {
    lightweightFeature: props.lightweightFeature,
    feature: resolvedFeature,
    featureId: props.featureId,
    sources: resolvedSources,
    equipmentInfoId: props.equipmentInfoId,
    equipmentInfo: resolvedEquimentInfo,
  };
}

export async function awaitPlaceDetails(
  props: PlaceDetailsProps
): Promise<ResolvedPlaceDetailsProps> {
  const resolvedFeature = await getDataPromise(props.feature);
  const resolvedSources = await getDataPromise(props.sources);
  const resolvedEquipmentInfo = props.equipmentInfo
    ? await getDataPromise(props.equipmentInfo)
    : null;

  return {
    lightweightFeature: props.lightweightFeature,
    feature: resolvedFeature,
    featureId: props.featureId,
    sources: resolvedSources,
    equipmentInfoId: props.equipmentInfoId,
    equipmentInfo: resolvedEquipmentInfo,
  };
}
