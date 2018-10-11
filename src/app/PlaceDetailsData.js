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
      dataSourceCache.getDataSourceWithId(sourceId, { useCache }).then(async (source): Promise<
        SourceWithLicense
      > => {
        if (typeof source.licenseId === 'string') {
          const license = await licenseCache.getLicenseWithId(source.licenseId, { useCache });
          return { source, license };
        }
        return { source, license: null };
      })
    );

    return Promise.all(sourcesWithLicense);
  }

  return Promise.resolve([]);
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

      // console.log("loaded", feature, { useCache, feature });

      const equipmentPromise = equipmentInfoId ? fetchEquipment(equipmentInfoId, useCache) : null;
      const equipmentInfo = equipmentPromise
        ? isServer ? await equipmentPromise : equipmentPromise
        : null;

      // console.log("loading", { useCache });
      const sourcesPromise = fetchSourceWithLicense(featureId, feature, useCache);
      const sources = isServer ? await sourcesPromise : sourcesPromise;
      // console.log("sources", sources, { useCache, feature });

      return {
        feature,
        featureId,
        sources,
        lightweightFeature: null,
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
        lightweightFeature: null,
        equipmentInfoId: null,
        equipmentInfo: null,
      };
    }
  },

  clientStoreInitialProps(props: PlaceDetailsProps) {
    const { feature, featureId, sources } = props;
    // only store fully resolved data that comes from the server
    if (!feature || feature instanceof Promise || sources instanceof Promise) {
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

  getHead(props, isMainApp) {
    const { feature, clientSideConfiguration } = props;
    const { name: productName } = clientSideConfiguration.textContent.product;

    const renderTitle = feature => {
      let extras;
      let fullTitle;
      let placeTitle;

      if (feature != null) {
        fullTitle = placeTitle = feature.properties && placeNameFor(feature.properties);
        const accessibilityTitle =
          feature.properties && accessibilityName(isWheelchairAccessible(feature.properties));

        if (placeTitle && accessibilityTitle) {
          fullTitle = `${placeTitle}, ${accessibilityTitle}`;
        }

        const coordinates = normalizedCoordinatesForFeature(feature);
        const thisPlaceIsOn = t`This place is on ${productName}: ${placeTitle}`;

        extras = [
          coordinates != null && (
            <meta
              content={coordinates[1]}
              property="place:location:latitude"
              key="place:location:latitude"
            />
          ),
          coordinates != null && (
            <meta
              content={coordinates[0]}
              property="place:location:longitude"
              key="place:location:longitud"
            />
          ),
          <meta
            content={router.generate('place_detail', { id: getFeatureId(feature) })}
            property="og:url"
            key="og:url"
          />,
          placeTitle && <meta content={thisPlaceIsOn} property="og:title" key="og:title" />,
          placeTitle &&
            isMainApp && (
              <meta content={thisPlaceIsOn} property="twitter:title" key="twitter:title" />
            ),
        ];
      }

      return (
        <React.Fragment>
          {extras}
          <meta content="place" property="og:type" key="og:type" />
          <title key="title">{getProductTitle(clientSideConfiguration, fullTitle)}</title>
        </React.Fragment>
      );
    };

    if (feature instanceof Promise) {
      return feature.then(feature => renderTitle(feature));
    }

    return renderTitle(feature);
  },
};

export default PlaceDetailsData;
