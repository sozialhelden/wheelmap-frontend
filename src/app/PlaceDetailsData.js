// @flow

import React from 'react';
import { t } from 'ttag';

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

import { type DataTableEntry } from './getInitialProps';
import { type PlaceDetailsProps, type SourceWithLicense } from './PlaceDetailsProps';
import router from './router';
import { getProductTitle } from '../lib/ClientSideConfiguration';
import { type EquipmentInfo } from '../lib/EquipmentInfo';

import type { PhotoModel } from '../lib/PhotoModel';

import { wheelmapFeaturePhotosCache } from '../lib/cache/WheelmapFeaturePhotosCache';
import convertWheelmapPhotosToLightboxPhotos from '../lib/cache/convertWheelmapPhotosToLightboxPhotos';

import { accessibilityCloudImageCache } from '../lib/cache/AccessibilityCloudImageCache';
import convertAcPhotosToLightboxPhotos from '../lib/cache/convertAcPhotosToLightboxPhotos';

function fetchFeature(featureId: string, useCache: boolean): Promise<Feature> {
  const isWheelmap = isWheelmapFeatureId(featureId);

  if (isWheelmap) {
    return wheelmapFeatureCache.fetchFeature(featureId, { useCache });
  }

  return accessibilityCloudFeatureCache.fetchFeature(featureId, { useCache });
}

function fetchEquipment(equipmentId: string, useCache: boolean): Promise<EquipmentInfo> {
  return equipmentInfoCache.fetchFeature(equipmentId, { useCache });
}

async function fetchSourceWithLicense(
  featureId: string | number,
  featurePromise: Promise<Feature>,
  useCache: boolean
): Promise<SourceWithLicense[]> {
  if (!isWheelmapFeatureId(featureId)) {
    const feature = await featurePromise;
    const sourceIds = sourceIdsForFeature(feature);

    // console.log("loading", { sources });
    const sourcesWithLicense = sourceIds.map(sourceId =>
      dataSourceCache.getDataSourceWithId(sourceId, { useCache }).then(
        async (source): Promise<SourceWithLicense> => {
          if (typeof source.licenseId === 'string') {
            const license = await licenseCache.getLicenseWithId(source.licenseId, { useCache });
            return { source, license };
          }
          return { source, license: null };
        }
      )
    );

    return Promise.all(sourcesWithLicense);
  }

  return Promise.resolve([]);
}

function fetchPhotos(featureId: string | number, useCache: boolean) {
  const isWheelmap = isWheelmapFeatureId(featureId);

  var photosPromise = Promise.all([
    accessibilityCloudImageCache.getPhotosForFeature(featureId, { useCache }).then(acPhotos => {
      if (acPhotos) {
        return convertAcPhotosToLightboxPhotos(acPhotos);
      }
      return [];
    }),
    isWheelmap
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
  async getInitialProps(query, isServer): Promise<PlaceDetailsProps> {
    const featureId = query.id;
    const equipmentInfoId = query.eid;

    try {
      if (!featureId) {
        const error = new Error('No feature id passed into placeDetailsData');
        error.statusCode = 404;
        throw error;
      }

      // do not cache on server
      const useCache = !isServer;

      // console.log("loading", { useCache });
      const featurePromise = fetchFeature(featureId, useCache);
      const feature = isServer ? await featurePromise : featurePromise;

      const lightweightFeature = wheelmapLightweightFeatureCache.getCachedFeature(featureId);

      // console.log("loaded", feature, { useCache, feature });

      const equipmentPromise = equipmentInfoId ? fetchEquipment(equipmentInfoId, useCache) : null;
      const equipmentInfo = (isServer ? await equipmentPromise : equipmentPromise) || null;

      // console.log("loading", { useCache });
      const sourcesPromise = fetchSourceWithLicense(featureId, feature, useCache);
      const sources = isServer ? await sourcesPromise : sourcesPromise;
      // console.log("sources", sources, { useCache, feature });

      const photosPromise = fetchPhotos(featureId, useCache);
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
      console.error('Failed loading feature', featureId);
      // TODO: how to redirect to 404 or other error
      return {
        feature: null,
        featureId: null,
        sources: [],
        photos: [],
        lightweightFeature: null,
        equipmentInfoId: null,
        equipmentInfo: null,
      };
    }
  },

  clientStoreInitialProps(props: PlaceDetailsProps) {
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
      const source = sourceWithLicense.source;
      const url = dataSourceCache.urlFromId(source._id);
      dataSourceCache.inject(url, source);

      const license = sourceWithLicense.license;
      if (license) {
        const url = licenseCache.urlFromId(license._id);
        licenseCache.inject(url, license);
      }
    });
  },

  getHead(props) {
    const { feature, photos, clientSideConfiguration } = props;
    const { textContent, meta } = clientSideConfiguration;

    const renderTitle = (feature, photos) => {
      const extras = [];
      let fullTitle;
      let placeTitle;
      let image;

      if (feature != null) {
        fullTitle = placeTitle = feature.properties && placeNameFor(feature.properties);
        const accessibilityTitle =
          feature.properties && accessibilityName(isWheelchairAccessible(feature.properties));

        if (placeTitle && accessibilityTitle) {
          fullTitle = `${placeTitle}, ${accessibilityTitle}`;
        }

        const coordinates = normalizedCoordinatesForFeature(feature);
        // translator: Title for sharing a place detail page
        const thisPlaceIsOn = t`This place is on ${textContent.product.name}: ${placeTitle}`;

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
            content={router.generate('place_detail', { id: getFeatureId(feature) })}
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
