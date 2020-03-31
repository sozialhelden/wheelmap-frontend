// @flow

import { t } from 'ttag';
import fetch from '../../../lib/fetch';
import get from 'lodash/get';
import config from '../../../lib/config';
import { trackingEventBackend } from '../../../lib/TrackingEventBackend';
import { wheelmapFeatureCache } from '../../../lib/cache/WheelmapFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../../lib/cache/WheelmapLightweightFeatureCache';
import {
  type Feature,
  type YesNoLimitedUnknown,
  type YesNoUnknown,
  isWheelmapFeatureId,
} from '../../../lib/Feature';
import { trackEvent } from '../../../lib/Analytics';
import Categories, { getCategoryId } from '../../../lib/Categories';
import { type CategoryLookupTables } from '../../../lib/Categories';
import { type AppContextData } from '../../../AppContext';
import { accessibilityCloudFeatureCache } from '../../../lib/cache/AccessibilityCloudFeatureCache';

type ExternalSaveOptions<T> = {
  featureId: string,
  categories: CategoryLookupTables,
  feature: Feature,
  value: T,
  onSave: ?(value: T) => void,
  onClose: () => void,
  appContext: AppContextData,
};

type PropertyUpdates = { [key: string]: string | boolean | number | void };

type TrackableSaveOptions<T> = ExternalSaveOptions<T> & {
  propertyUpdates: PropertyUpdates,
  action: string,
};

type WheelmapSaveOptions<T> = TrackableSaveOptions<T> & {
  url: string,
  jsonPropertyName: string,
};

function trackAttributeChanged<T>(options: TrackableSaveOptions<T>) {
  const { categories, feature, featureId, propertyUpdates, appContext } = options;

  const { category, parentCategory } = Categories.getCategoriesForFeature(categories, feature);

  const categoryId = getCategoryId(category);
  const parentCategoryId = getCategoryId(parentCategory);

  Object.keys(propertyUpdates).forEach(propertyName => {
    trackingEventBackend.track(appContext.app, {
      type: 'AttributeChanged',
      category: categoryId ? categoryId : 'unknown',
      parentCategory: parentCategoryId ? parentCategoryId : undefined,
      placeInfoId: featureId,
      attributePath: `properties.${propertyName}`,
      previousValue: get(feature, `properties.${propertyName}`),
      newValue: propertyUpdates[propertyName],
      organizationId: appContext.app.organizationId,
      appId: appContext.app._id,
    });
  });
}

function finishRatingFlow<T>(options: TrackableSaveOptions<T>, promise: Promise<any>) {
  const { value, featureId, action, propertyUpdates } = options;

  return promise
    .then(json => {
      trackEvent({
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
    })
    .catch(e => {
      if (typeof options.onClose === 'function') options.onClose();
      // translator: Shown after marking a place did not work, for example because the connection was interrupted
      window.alert(t`Sorry, this place could not be marked because of an error: ${e}`);

      trackEvent({
        category: 'UpdateAccessibilityData',
        action,
        label: 'failed',
      });
    });
}

function saveToWheelmap<T>(options: WheelmapSaveOptions<T>): Promise<Response> {
  const { url, value } = options;

  const formData = new FormData();
  formData.append(options.jsonPropertyName, String(value));
  const body = formData;

  const requestOptions = {
    method: 'PUT',
    body,
    serializer: 'urlencoded',
    headers: {
      Accept: 'application/json',
    },
  };

  const result = fetch(url, requestOptions).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw response;
  });

  return finishRatingFlow(options, result);
}

function saveWheelmapToiletStatus(options: ExternalSaveOptions<YesNoUnknown>) {
  const url = `${config.wheelmapApiBaseUrl}/nodes/${options.featureId}/update_toilet.js?api_key=${config.wheelmapApiKey}`;
  return saveToWheelmap({
    ...options,
    url,
    action: 'toilet',
    propertyUpdates: { wheelchair_toilet: options.value },
    jsonPropertyName: 'toilet',
  });
}

function saveWheelmapWheelchairStatus(options: ExternalSaveOptions<YesNoLimitedUnknown>) {
  const url = `${config.wheelmapApiBaseUrl}/nodes/${options.featureId}/update_wheelchair.js?api_key=${config.wheelmapApiKey}`;
  return saveToWheelmap({
    ...options,
    url,
    action: 'wheelchair',
    propertyUpdates: { wheelchair: options.value },
    jsonPropertyName: 'wheelchair',
  });
}

function saveToAc<T>(
  mode: 'toilet' | 'wheelchair',
  rating: 'yes' | 'no' | 'unknown' | 'partial',
  propertyUpdates: PropertyUpdates,
  options: ExternalSaveOptions<T>
): Promise<Response> {
  const trackableOptions = {
    ...options,
    propertyUpdates,
    action: mode,
  };

  const result = accessibilityCloudFeatureCache.ratePlace(
    options.featureId,
    mode,
    rating,
    options.appContext.app.tokenString
  );

  return finishRatingFlow(trackableOptions, result);
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
