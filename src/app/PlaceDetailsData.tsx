import { compact, get } from 'lodash';
import React from 'react';
import { t } from 'ttag';

import {
  Feature,
  accessibilityCloudFeatureCollectionFromResponse,
  accessibilityName,
  getFeatureId,
  isWheelchairAccessible,
  isWheelmapFeature,
  isWheelmapFeatureId,
  normalizedCoordinatesForFeature,
  placeNameFor,
  sourceIdsForFeature,
  wheelmapFeatureFrom,
} from '../lib/Feature';
import { accessibilityCloudFeatureCache } from '../lib/cache/AccessibilityCloudFeatureCache';
import { dataSourceCache } from '../lib/cache/DataSourceCache';
import { equipmentInfoCache } from '../lib/cache/EquipmentInfoCache';
import { licenseCache } from '../lib/cache/LicenseCache';
import { wheelmapFeatureCache } from '../lib/cache/WheelmapFeatureCache';
import { wheelmapLightweightFeatureCache } from '../lib/cache/WheelmapLightweightFeatureCache';

import Categories from '../lib/Categories';

import { getProductTitle } from '../lib/ClientSideConfiguration';
import { EquipmentInfo } from '../lib/EquipmentInfo';
import {
  PlaceDetailsProps,
  SourceWithLicense,
  getDataIfAlreadyResolved,
} from './PlaceDetailsProps';
import { DataTableEntry, RenderContext } from './getInitialProps';
import router from './router';

import { globalFetchManager } from '../lib/FetchManager';
import { accessibilityCloudImageCache } from '../lib/cache/AccessibilityCloudImageCache';
import convertAcPhotosToLightboxPhotos from '../lib/cache/convertAcPhotosToLightboxPhotos';
import env from '../lib/env';
import { fetchToiletsNearFeature } from '../lib/getToiletsNearby';
import { translatedStringFromObject } from '../lib/i18n';

function fetchFeature(
  osmType: string,
  featureId: string,
  appToken: string,
  useCache: boolean,
  disableWheelmapSource?: boolean
): Promise<Feature> | null {
  const isWheelmap = !!osmType;
  if (isWheelmap) {
    if (disableWheelmapSource) {
      return null;
    }
    return wheelmapFeatureCache.fetchFeature(osmType + '/' + featureId, appToken, useCache);
  }

  return accessibilityCloudFeatureCache.fetchFeature(featureId, appToken, useCache);
}

function fetchEquipment(
  equipmentId: string,
  appToken: string,
  useCache: boolean
): Promise<EquipmentInfo> {
  return equipmentInfoCache.fetchFeature(equipmentId, appToken, useCache);
}

async function fetchSourceWithLicense(
  featureId: string | number,
  featurePromise: Promise<Feature> | null,
  appToken: string,
  useCache: boolean
): Promise<SourceWithLicense[]> {
  if (!isWheelmapFeatureId(featureId)) {
    const feature = await featurePromise;
    const sourceIds = sourceIdsForFeature(feature);

    // console.log("loading", { sources });
    const sourcesWithLicense = sourceIds.map(sourceId =>
      dataSourceCache
        .getDataSourceWithId(sourceId, appToken)
        .then(async (source): Promise<SourceWithLicense> => {
          if (typeof source.licenseId === 'string') {
            return licenseCache.getLicenseWithId(source.licenseId, appToken).then(license => {
              return { source, license };
            });
          }
          return { source, license: null };
        })
    );

    return Promise.all(sourcesWithLicense);
  }

  return Promise.resolve([]);
}

function fetchPhotos(
  feature: Feature,
  appToken: string,
  useCache: boolean,
) {
  const featureId = getFeatureId(feature);
  const osmFeature = wheelmapFeatureFrom(feature);
  const surveyResultId = get(feature, 'properties.surveyResultId');
  const isOSMWay = isWheelmapFeature(feature) && feature.properties.osm_type === 'way';
  const photosPromise = Promise.all(compact([
    osmFeature && accessibilityCloudImageCache
      .getImage('osmGeometry', 'osm:' + osmFeature.properties.osm_type + '/' + osmFeature.id, appToken, useCache)
      .then(acPhotos => acPhotos ? convertAcPhotosToLightboxPhotos(acPhotos) : []),
    accessibilityCloudImageCache
      .getImage('place', isOSMWay ? String(-featureId) : featureId, appToken, useCache)
      .then(acPhotos => acPhotos ? convertAcPhotosToLightboxPhotos(acPhotos) : []),
    surveyResultId ?
      accessibilityCloudImageCache
        .getImage('surveyResult', surveyResultId, appToken, useCache)
        .then(acPhotos => acPhotos ? convertAcPhotosToLightboxPhotos(acPhotos) : [])
      : [],
  ]))
    .then(photoArrays => photoArrays.flat())
    .catch(err => {
      console.error(err);
      return [];
    });

  return photosPromise;
}

function fetchToiletsNearby(
  renderContext: RenderContext,
  featurePromise: Promise<Feature> | null
): Promise<Feature[]> | Feature[] {
  return featurePromise
    ? featurePromise.then(feature => {
        return fetchToiletsNearFeature(
          feature,
          renderContext.disableWheelmapSource || false,
          renderContext.includeSourceIds,
          renderContext.includeSourceIds,
          renderContext.app.tokenString
        );
      })
    : [];
}

function fetchAcChildPlaces(
  parentPlaceInfoId: string,
  appToken?: string
): Promise<Feature[]> {
  const baseUrl = env.REACT_APP_ACCESSIBILITY_CLOUD_BASE_URL || '';
  const url = `${baseUrl}/place-infos.json?parentPlaceInfoId=${parentPlaceInfoId}&limit=100&appToken=${appToken}`;
  return globalFetchManager
    .fetch(url)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    })
    .then(responseJson => {
      const parsed = responseJson && accessibilityCloudFeatureCollectionFromResponse(responseJson);
      return parsed ? parsed.features : [];
    });
}


const PlaceDetailsData: DataTableEntry<PlaceDetailsProps> = {
  async getInitialRouteProps(query, renderContextPromise, isServer): Promise<PlaceDetailsProps> {
    const featureId = query.id;
    const equipmentInfoId = query.eid;

    if (!featureId) {
      const error: Error & { statusCode?: number } = new Error(
        'No feature id passed into placeDetailsData'
      );
      error.statusCode = 404;
      throw error;
    }
    if (!featureId.match(/\w+/)) {
      const error: Error & { statusCode?: number } = new Error(
        'Invalid feature ID.'
      );
      error.statusCode = 404;
      throw error;
    }
    // do not cache features on server
    const useCache = !isServer;
    const disableWheelmapSource = query.disableWheelmapSource === 'true';
    console.log('query', query);
    const renderContext = await renderContextPromise;
    const appToken = renderContext.app.tokenString;
    const osmType = ['way', 'node', 'relation'].includes(query.routeName) ? query.routeName : null;
    const featurePromise = fetchFeature(osmType, featureId, appToken, useCache, disableWheelmapSource);
    const equipmentPromise = equipmentInfoId
      ? fetchEquipment(equipmentInfoId, appToken, useCache)
      : null;
    const lightweightFeature = !disableWheelmapSource
      ? wheelmapLightweightFeatureCache.getCachedFeature(featureId)
      : null;
    const sourcesPromise = fetchSourceWithLicense(featureId, featurePromise, appToken, true);
    const toiletsNearby = isServer
      ? undefined
      : fetchToiletsNearby(renderContext, featurePromise);
    const childPlaceInfosPromise = fetchAcChildPlaces(featureId, appToken);

    const photosPromise = featurePromise.then(feature =>
      fetchPhotos(feature, appToken, useCache));

    const [feature, equipmentInfo, sources, photos, childPlaceInfos] = await Promise.all([
      featurePromise,
      equipmentPromise,
      sourcesPromise,
      photosPromise,
      childPlaceInfosPromise,
    ]);

    return {
      feature,
      featureId,
      sources,
      photos,
      lightweightFeature,
      equipmentInfoId,
      equipmentInfo,
      toiletsNearby,
      childPlaceInfos,
      renderContext,
    };
  },

  storeInitialRouteProps(props: PlaceDetailsProps, appToken: string) {
    const { feature, sources, equipmentInfo } = props;

    // only store fully resolved data that comes from the server
    if (
      !feature ||
      feature instanceof Promise ||
      sources instanceof Promise ||
      equipmentInfo instanceof Promise
    ) {
      return;
    }

    // inject feature
    if (isWheelmapFeature(feature)) {
      wheelmapFeatureCache.injectFeature(feature);
    } else {
      accessibilityCloudFeatureCache.injectFeature(feature);
    }

    const sourceWithLicenseArray: SourceWithLicense[] = sources;
    // inject sources & licenses
    sourceWithLicenseArray.forEach(sourceWithLicense => {
      const { license, source } = sourceWithLicense;
      dataSourceCache.injectDataSource(source, appToken);

      if (license) {
        licenseCache.injectLicense(license, appToken);
      }
    });
  },

  getAdditionalPageComponentProps(props, isServer) {
    if (isServer) {
      return props;
    }

    let { toiletsNearby, feature } = props;
    if (!toiletsNearby) {
      // fetch toilets for client
      const featurePromise = feature instanceof Promise ? feature : Promise.resolve(feature);
      toiletsNearby = fetchToiletsNearby(props.renderContext, featurePromise);
    }

    return { ...props, toiletsNearby };
  },

  getHead(props, baseUrl) {
    // @ts-ignore
    const { feature, photos, app, categories, equipmentInfo } = props;
    const { textContent, meta } = app.clientSideConfiguration;

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
          feature.properties && accessibilityName(isWheelchairAccessible(feature.properties), app.clientSideConfiguration);

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
                content={String(coordinates[i])}
                property={`place:location:${property}`}
                key={`place:location:${property}`}
              />
            ))
          );
        }

        const placeDetailPath = router.generatePath('placeDetail', {
          id: getFeatureId(feature),
        });
        const ogUrl = baseUrl ? `${baseUrl}${placeDetailPath}` : placeDetailPath;

        extras.push(<meta content={ogUrl} property="og:url" key="og:url" />);

        if (placeTitle) {
          extras.push(<meta content={thisPlaceIsOn} property="og:title" key="og:title" />);

          if (meta?.twitter?.siteHandle || meta?.twitter?.creatorHandle) {
            extras.push(
              <meta content={thisPlaceIsOn} property="twitter:title" key="twitter:title" />
            );
          }
        }
      }

      if (photos.length > 0) {
        const image = photos[0].original;

        extras.push(<meta content={image} property="og:image" key="og:image" />);

        if (meta?.twitter?.siteHandle || meta?.twitter?.creatorHandle) {
          extras.push(<meta content={image} property="twitter:image" key="twitter:image" />);
        }
      }

      extras.unshift(
        <meta content="place" property="og:type" key="og:type" />,
        <title key="title">{getProductTitle(app.clientSideConfiguration, fullTitle)}</title>
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
