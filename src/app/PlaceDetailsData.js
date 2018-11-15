// @flow

import React from 'react';
import { t } from 'ttag';
import { get } from 'lodash';

import {
  type Feature,
  isWheelmapFeatureId,
  type WheelmapFeature,
  type AccessibilityCloudFeature,
  sourceIdsForFeature,
} from '../lib/Feature';
import { licenseCache } from '../lib/cache/LicenseCache';
import { dataSourceCache } from '../lib/cache/DataSourceCache';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import { wheelmapLightweightFeatureCache } from '../lib/cache/WheelmapLightweightFeatureCache';
import { accessibilityCloudFeatureCache } from '../lib/cache/AccessibilityCloudFeatureCache';
import { equipmentInfoCache } from '../lib/cache/EquipmentInfoCache';
import {
  placeNameFor,
  isWheelchairAccessible,
  accessibilityName,
  normalizedCoordinatesForFeature,
  getFeatureId,
} from '../lib/Feature';

import Categories from '../lib/Categories';

import { type DataTableEntry } from './getInitialProps';
import {
  type PlaceDetailsProps,
  type SourceWithLicense,
  getDataIfAlreadyResolved,
} from './PlaceDetailsProps';
import router from './router';
import { getProductTitle } from '../lib/ClientSideConfiguration';
import { type EquipmentInfo } from '../lib/EquipmentInfo';

import type { PhotoModel } from '../lib/PhotoModel';

import { wheelmapFeaturePhotosCache } from '../lib/cache/WheelmapFeaturePhotosCache';
import convertWheelmapPhotosToLightboxPhotos from '../lib/cache/convertWheelmapPhotosToLightboxPhotos';

import { accessibilityCloudImageCache } from '../lib/cache/AccessibilityCloudImageCache';
import convertAcPhotosToLightboxPhotos from '../lib/cache/convertAcPhotosToLightboxPhotos';
import { translatedStringFromObject } from '../lib/i18n';

function fetchFeature(
  featureId: string,
  { useCache, disableWheelmapSource }: { useCache: boolean, disableWheelmapSource?: boolean }
): ?Promise<Feature> {
  const isWheelmap = isWheelmapFeatureId(featureId);

  if (isWheelmap) {
    if (disableWheelmapSource) {
      return null;
    }
    return wheelmapFeatureCache.fetchFeature(featureId, { useCache });
  }

  return accessibilityCloudFeatureCache.fetchFeature(featureId, { useCache });
}

function fetchEquipment(equipmentId: string, useCache: boolean): Promise<EquipmentInfo> {
  return equipmentInfoCache.fetchFeature(equipmentId, { useCache });
}

async function fetchSourceWithLicense(
  featureId: string | number,
  featurePromise: ?Promise<Feature>,
  useCache: boolean
): Promise<SourceWithLicense[]> {
  if (!isWheelmapFeatureId(featureId)) {
    const feature = await featurePromise;
    const sourceIds = sourceIdsForFeature(feature);

    // console.log("loading", { sources });
    const sourcesWithLicense = sourceIds.map(sourceId =>
      dataSourceCache.getDataSourceWithId(sourceId).then(
        async (source): Promise<SourceWithLicense> => {
          if (typeof source.licenseId === 'string') {
            return licenseCache.getLicenseWithId(source.licenseId).then(license => {
              return { source, license };
            });
          }
          return { source, license: null };
        }
      )
    );

    return Promise.all(sourcesWithLicense);
  }

  return Promise.resolve([]);
}

function fetchPhotos(
  featureId: string | number,
  { useCache, disableWheelmapSource }: { useCache: boolean, disableWheelmapSource?: boolean }
) {
  const isWheelmap = isWheelmapFeatureId(featureId);
  const useWheelmap = isWheelmap && !disableWheelmapSource;

  var photosPromise = Promise.all([
    accessibilityCloudImageCache.getPhotosForFeature(featureId, { useCache }).then(acPhotos => {
      if (acPhotos) {
        return convertAcPhotosToLightboxPhotos(acPhotos);
      }
      return [];
    }),
    useWheelmap
      ? wheelmapFeaturePhotosCache.getPhotosForFeature(featureId, { useCache }).then(wmPhotos => {
          if (wmPhotos) {
            return convertWheelmapPhotosToLightboxPhotos(wmPhotos);
          }
          return [];
        })
      : Promise.resolve([]),
  ]).then((photoArrays: PhotoModel[][]) => {
    return [].concat(photoArrays[0], photoArrays[1]);
  });

  return photosPromise;
}

const PlaceDetailsData: DataTableEntry<PlaceDetailsProps> = {
  async getInitialRouteProps(query, isServer): Promise<PlaceDetailsProps> {
    const featureId = query.id;
    const equipmentInfoId = query.eid;

    try {
      if (!featureId) {
        const error: Error & { statusCode?: number } = new Error(
          'No feature id passed into placeDetailsData'
        );
        error.statusCode = 404;
        throw error;
      }

      // do not cache on server
      const useCache = !isServer;
      const disableWheelmapSource = query.disableWheelmapSource === 'true';

      const featurePromise = fetchFeature(featureId, { useCache, disableWheelmapSource });
      const photosPromise = fetchPhotos(featureId, { useCache, disableWheelmapSource });
      const equipmentPromise = equipmentInfoId ? fetchEquipment(equipmentInfoId, useCache) : null;
      const lightweightFeature = !disableWheelmapSource
        ? wheelmapLightweightFeatureCache.getCachedFeature(featureId)
        : null;
      const sourcesPromise = fetchSourceWithLicense(featureId, featurePromise, useCache);

      const feature = isServer ? await featurePromise : featurePromise;
      const equipmentInfo = (isServer ? await equipmentPromise : equipmentPromise) || null;
      const sources = isServer ? await sourcesPromise : sourcesPromise;
      const photos = isServer ? await photosPromise : photosPromise;

      return {
        feature,
        featureId,
        sources,
        photos,
        lightweightFeature,
        equipmentInfoId,
        equipmentInfo,
      };
    } catch (e) {
      const error: Error & { parent?: any, statusCode?: number } = new Error(
        'Failed loading feature'
      );
      error.parent = e;
      error.statusCode = 404;
      throw error;
    }
  },

  storeInitialRouteProps(props: PlaceDetailsProps) {
    const { feature, featureId, sources, photos, equipmentInfo } = props;
    // only store fully resolved data that comes from the server
    if (
      !feature ||
      feature instanceof Promise ||
      sources instanceof Promise ||
      photos instanceof Promise ||
      equipmentInfo instanceof Promise
    ) {
      return;
    }

    // inject feature
    const isWheelmap = isWheelmapFeatureId(featureId);
    if (isWheelmap) {
      wheelmapFeatureCache.injectFeature(((feature: any): WheelmapFeature));
    } else {
      accessibilityCloudFeatureCache.injectFeature(((feature: any): AccessibilityCloudFeature));
    }

    const sourceWithLicenseArray = ((sources: any): SourceWithLicense[]);
    // inject sources & licenses
    sourceWithLicenseArray.forEach(sourceWithLicense => {
      const { license, source } = sourceWithLicense;
      dataSourceCache.injectDataSource(source);

      if (license) {
        licenseCache.injectLicense(license);
      }
    });
  },

  getHead(props) {
    const { feature, photos, clientSideConfiguration, categories, equipmentInfo } = props;
    const { textContent, meta } = clientSideConfiguration;

    const renderTitle = (feature, photos) => {
      const extras = [];
      let fullTitle;
      let placeTitle;

      if (feature != null) {
        const { category, parentCategory } = Categories.getCategoriesForFeature(
          categories,
          (equipmentInfo && getDataIfAlreadyResolved(equipmentInfo)) ||
            getDataIfAlreadyResolved(feature)
        );

        fullTitle = placeTitle =
          feature.properties && placeNameFor(feature.properties, category || parentCategory);
        const accessibilityTitle =
          feature.properties && accessibilityName(isWheelchairAccessible(feature.properties));

        if (placeTitle && accessibilityTitle) {
          fullTitle = `${placeTitle}, ${accessibilityTitle}`;
        }

        const coordinates = normalizedCoordinatesForFeature(feature);
        // translator: Title for sharing a place detail page
        const productName = translatedStringFromObject(get(textContent, 'product.name'));
        const thisPlaceIsOn = t`This place is on ${productName}: ${placeTitle}`;

        if (coordinates) {
          extras.push(
            ...['longitude', 'latitude'].map((property, i) => (
              <meta
                content={coordinates[i]}
                property={`place:location:${property}`}
                key={`place:location:${property}`}
              />
            ))
          );
        }

        extras.push(
          <meta
            content={router.generatePath('place_detail', { id: getFeatureId(feature) })}
            property="og:url"
            key="og:url"
          />
        );

        if (placeTitle) {
          extras.push(<meta content={thisPlaceIsOn} property="og:title" key="og:title" />);

          if (meta.twitter.siteHandle || meta.twitter.creatorHandle) {
            extras.push(
              <meta content={thisPlaceIsOn} property="twitter:title" key="twitter:title" />
            );
          }
        }
      }

      if (photos.length > 0) {
        const image = photos[0].original;

        extras.push(<meta content={image} property="og:image" key="og:image" />);

        if (meta.twitter.siteHandle || meta.twitter.creatorHandle) {
          extras.push(<meta content={image} property="twitter:image" key="twitter:image" />);
        }
      }

      extras.unshift(
        <meta content="place" property="og:type" key="og:type" />,
        <title key="title">{getProductTitle(clientSideConfiguration, fullTitle)}</title>
      );

      return <React.Fragment>{extras}</React.Fragment>;
    };

    if (feature instanceof Promise || photos instanceof Promise) {
      return Promise.all([feature, photos]).then(([feature, photos]) =>
        renderTitle(feature, photos)
      );
    }

    return renderTitle(feature, photos);
  },
};

export default PlaceDetailsData;
