import get from 'lodash/get';
import { t } from 'ttag';
import { AppContextData } from '../../../AppContext';
import { trackEventExternally } from '../../../lib/Analytics';
import { accessibilityCloudFeatureCache } from '../../../lib/cache/AccessibilityCloudFeatureCache';
import { wheelmapFeatureCache } from '../../../lib/cache/WheelmapFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../../lib/cache/WheelmapLightweightFeatureCache';
import Categories, { CategoryLookupTables, getCategoryId } from '../../../lib/Categories';
import env from '../../../lib/env';
import {
  Feature,
  YesNoLimitedUnknown,
  YesNoUnknown,
  isWheelmapFeature,
  isWheelmapFeatureId,
} from '../../../lib/Feature';
import fetch from '../../../lib/fetch';
import { trackingEventBackend } from '../../../lib/TrackingEventBackend';
import { saveEditInLocalStorage } from './LastEditsStorage';

type ExternalSaveOptions<T> = {
  featureId: string,
  categories: CategoryLookupTables,
  feature: Feature,
  value: T,
  onSave: (value: T) => void | null,
  onClose: () => void,
  appContext: AppContextData,
};

type PropertyUpdates = { [key: string]: string | boolean | number | void };

type TrackableSaveOptions<T> = ExternalSaveOptions<T> & {
  propertyUpdates: PropertyUpdates,
  action: string,
};

function trackAttributeChanged<T>(options: TrackableSaveOptions<T>) {
  const { categories, feature, featureId, propertyUpdates, appContext } = options;

  const { category, parentCategory } = Categories.getCategoriesForFeature(categories, feature);

  const categoryId = getCategoryId(category);
  const parentCategoryId = getCategoryId(parentCategory);
  const osmFeature = isWheelmapFeature(feature) ? feature : undefined;
  const acFeature = isWheelmapFeature(feature) ? undefined : feature;
  const osmType = osmFeature && osmFeature.properties.osm_type;
  const osmId = osmFeature && osmFeature.properties.id;
  const osmFeatureUrl = osmFeature && `https://www.openstreetmap.org/${osmType}/${osmId}`;
  const acFeatureUrl = acFeature && `https://accessibility.cloud/place-infos/${acFeature.properties._id}`;
  const featureUrl = osmFeatureUrl || acFeatureUrl;

  Object.keys(propertyUpdates).forEach(propertyName => {
    trackingEventBackend.track(appContext.app, {
      type: 'AttributeChanged',
      category: categoryId ? categoryId : 'unknown',
      parentCategory: parentCategoryId ? parentCategoryId : undefined,
      placeInfoId: featureId,
      osmId,
      osmType,
      featureUrl,
      attributePath: `properties.${propertyName}`,
      previousValue: get(feature, `properties.${propertyName}`),
      newValue: propertyUpdates[propertyName],
      organizationId: appContext.app.organizationId,
      appId: appContext.app._id,
      geometry: feature.geometry,
      longitude: feature.geometry.coordinates[0],
      latitude: feature.geometry.coordinates[1],
    });
  });
}

async function finishRatingFlow<T>(options: TrackableSaveOptions<T>) {
  const { value, featureId, action, propertyUpdates } = options;
  try {
    trackEventExternally({
      category: 'UpdateAccessibilityData',
      action,
      label: String(value),
    });
    trackAttributeChanged(options);

    if (isWheelmapFeatureId(featureId)) {
      [wheelmapFeatureCache, wheelmapLightweightFeatureCache].forEach(cache => {
        if (cache.getCachedFeature(featureId)) {
          cache.updateFeatureAttribute(featureId, propertyUpdates);
        }
      });
    } else {
      accessibilityCloudFeatureCache.updateFeatureAttribute(featureId, propertyUpdates);
    }
    if (typeof options.onSave === 'function') options.onSave(value);
  }
  catch (e) {
    if (typeof options.onClose === 'function') options.onClose();
    // translator: Shown after marking a place did not work, for example because the connection was interrupted
    window.alert(t`Sorry, this place could not be marked because of an error: ${e}`);

    trackEventExternally({
      category: 'UpdateAccessibilityData',
      action,
      label: 'failed',
    });
  }
}

// todo delete
async function saveToWheelmap<T>(options: TrackableSaveOptions<T>): Promise<void> {
  if (!isWheelmapFeature(options.feature)) {
    throw new Error('Cannot save to Wheelmap: Feature is not a Wheelmap feature.');
  }

  const osmType = options.feature.properties.osm_type;
  const osmId = options.feature.properties.id;
  const baseUrl = env.REACT_APP_OSM_API_LEGACY_BASE_URL;
  if (!baseUrl) {
    throw new Error('Cannot save to Wheelmap: REACT_APP_OSM_API_LEGACY_BASE_URL is not set.');
  }
  const tag = {
    'wheelchair': 'wheelchair',
    'toilet': 'toilets:wheelchair',
  }[options.action];
  const url = `${baseUrl}/api/${osmType}/${osmId}/${tag}`;
  console.log('saveToWheelmap options', JSON.stringify(options, null , 2) );
  console.log('saveToWheelmap osmapi url', url);
  const requestInit = {
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
    body: `{ "value": "${options.value}" }`,
  };
  console.log('saveToWheelmap requestInit:', requestInit);
  const response = await fetch(url, requestInit);
  await response.json();
  saveEditInLocalStorage({ timestamp: Date.now(), lat: options.feature.geometry.coordinates[1], lon: options.feature.geometry.coordinates[0]});
  return finishRatingFlow(options);
}

function saveWheelmapToiletStatus(options: ExternalSaveOptions<YesNoUnknown>) {
  return saveToWheelmap({
    ...options,
    action: 'toilet',
    propertyUpdates: { wheelchair_toilet: options.value },
  });
}

function saveWheelmapWheelchairStatus(options: ExternalSaveOptions<YesNoLimitedUnknown>) {
  return saveToWheelmap({
    ...options,
    action: 'wheelchair',
    propertyUpdates: { wheelchair: options.value },
  });
}

async function saveToAc<T>(
  mode: 'toilet' | 'wheelchair',
  rating: 'yes' | 'no' | 'unknown' | 'partial',
  propertyUpdates: PropertyUpdates,
  options: ExternalSaveOptions<T>
): Promise<void> {
  const trackableOptions = {
    ...options,
    propertyUpdates,
    action: mode,
  };

  await accessibilityCloudFeatureCache.ratePlace(
    options.featureId,
    mode,
    rating,
    options.appContext.app.tokenString
  );

  return finishRatingFlow(trackableOptions);
}

function yesNoUnknownAsBoolean(value: YesNoUnknown) {
  if (value === 'yes') {
    return true;
  }
  if (value === 'no') {
    return false;
  }

  return undefined;
}

function yesNoLimitedUnknownAsBoolean(value: YesNoLimitedUnknown, checkLimited: boolean = false) {
  if (checkLimited && value === 'limited') {
    return true;
  }

  if (value === 'yes') {
    return true;
  }
  if (value === 'no') {
    return false;
  }
  return undefined;
}

function saveAcToiletStatus(options: ExternalSaveOptions<YesNoUnknown>) {
  const propertyUpdates = {
    'accessibility.restrooms.0.isAccessibleWithWheelchair': yesNoUnknownAsBoolean(options.value),
  };
  return saveToAc('toilet', options.value, propertyUpdates, options);
}

function saveAcWheelchairStatus(options: ExternalSaveOptions<YesNoLimitedUnknown>) {
  const rating = options.value === 'limited' ? 'partial' : options.value;
  const propertyUpdates = {
    'accessibility.accessibleWith.wheelchair': yesNoLimitedUnknownAsBoolean(options.value),
    'accessibility.partiallyAccessibleWith.wheelchair': yesNoLimitedUnknownAsBoolean(
      options.value,
      true
    ),
  };
  return saveToAc('wheelchair', rating, propertyUpdates, options);
}

export function saveToiletStatus(options: ExternalSaveOptions<YesNoUnknown>) {
  if (isWheelmapFeatureId(options.featureId)) {
    return saveWheelmapToiletStatus(options);
  } else {
    return saveAcToiletStatus(options);
  }
}

export function saveWheelchairStatus(options: ExternalSaveOptions<YesNoLimitedUnknown>) {
  if (isWheelmapFeatureId(options.featureId)) {
    return saveWheelmapWheelchairStatus(options);
  } else {
    return saveAcWheelchairStatus(options);
  }
}
