import { Feature, WheelmapLightweightFeature } from '../lib/Feature';

import { DataSource } from '../lib/cache/DataSourceCache';
import { License } from '../lib/cache/LicenseCache';
import { EquipmentInfo } from '../lib/EquipmentInfo';
import { PhotoModel } from '../lib/PhotoModel';

export type SourceWithLicense = {
  source: DataSource,
  license: License | undefined,
};

export type PotentialPromise<T> = T | Promise<T>;

export function getDataIfAlreadyResolved<T>(potentialPromise: PotentialPromise<T>): T | null {
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
  lightweightFeature: WheelmapLightweightFeature | undefined,
  // full feature, sync on server, async on client
  feature: PotentialPromise<Feature | undefined>,
  // the feature id
  featureId: string | number,
  // all sources for this feature with a license attached
  sources: PotentialPromise<SourceWithLicense[]>,
  // all photos for this feature
  photos: PotentialPromise<PhotoModel[]>,
  // the equimentInfo id
  equipmentInfoId: string | undefined,
  // the equimentInfo
  equipmentInfo: PotentialPromise<EquipmentInfo> | undefined,
  // toilets around the selected feature
  toiletsNearby: PotentialPromise<Feature[]> | undefined,
};

export type ResolvedPlaceDetailsProps = {
  // preloaded feature, if it exists
  lightweightFeature: WheelmapLightweightFeature | undefined,
  // full feature, sync on server, async on client
  feature: Feature | undefined,
  // the feature id
  featureId: string | number,
  // all sources for this feature with a license attached
  sources: SourceWithLicense[],
  // all photos for this feature
  photos: PhotoModel[],
  // the equimentInfo id
  equipmentInfoId: string | undefined,
  // the equimentInfo
  equipmentInfo: EquipmentInfo | undefined,
  // toilets around the selected feature
  toiletsNearby: Feature[] | undefined,
};

export function getPlaceDetailsIfAlreadyResolved(
  props: PlaceDetailsProps
): ResolvedPlaceDetailsProps | null {
  const resolvedFeature = getDataIfAlreadyResolved(props.feature);
  const resolvedSources = getDataIfAlreadyResolved(props.sources);
  const resolvedPhotos = getDataIfAlreadyResolved(props.photos);
  const resolvedEquimentInfo = props.equipmentInfo
    ? getDataIfAlreadyResolved(props.equipmentInfo)
    : null;
  const resolvedToiletsNearby = props.toiletsNearby
    ? getDataIfAlreadyResolved(props.toiletsNearby)
    : null;

  if (!resolvedFeature || (props.equipmentInfo && !resolvedEquimentInfo)) {
    return null;
  }

  return {
    lightweightFeature: props.lightweightFeature,
    feature: resolvedFeature,
    featureId: props.featureId,
    sources: resolvedSources || [],
    photos: resolvedPhotos || [],
    equipmentInfoId: props.equipmentInfoId,
    equipmentInfo: resolvedEquimentInfo,
    toiletsNearby: resolvedToiletsNearby || [],
  };
}

export async function awaitPlaceDetails(
  props: PlaceDetailsProps
): Promise<ResolvedPlaceDetailsProps> {
  const resolvedFeature = await getDataPromise(props.feature);
  const resolvedSources = await getDataPromise(props.sources);
  const resolvedPhotos = await getDataPromise(props.photos);
  const resolvedEquipmentInfo = props.equipmentInfo
    ? await getDataPromise(props.equipmentInfo)
    : null;
  const resolvedToiletsNearby = props.toiletsNearby
    ? await getDataPromise(props.toiletsNearby)
    : null;

  return {
    lightweightFeature: props.lightweightFeature,
    feature: resolvedFeature,
    featureId: props.featureId,
    sources: resolvedSources,
    photos: resolvedPhotos,
    equipmentInfoId: props.equipmentInfoId,
    equipmentInfo: resolvedEquipmentInfo,
    toiletsNearby: resolvedToiletsNearby,
  };
}
