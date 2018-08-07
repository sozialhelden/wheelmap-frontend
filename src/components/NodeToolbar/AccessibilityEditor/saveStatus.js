import { t } from 'ttag';
import fetch from '../../../lib/fetch';
import config from '../../../lib/config';
import { wheelmapFeatureCache } from '../../../lib/cache/WheelmapFeatureCache';
import { wheelmapLightweightFeatureCache } from '../../../lib/cache/WheelmapLightweightFeatureCache';
import { YesNoLimitedUnknown } from '../../../lib/Feature';

type ExternalSaveOptions<T> = {
  featureId: string,
  value: T,
  onSave: ?((T) => void),
  onClose: (() => void),
};

type SaveOptions<T> = ExternalSaveOptions<T> & {
  url: string,
  propertyName: string,
  jsonPropertyName: string,
};

function save<T>(options: SaveOptions<T>): Promise<Response> {
  const { url, value, featureId, propertyName } = options;

  const formData = new FormData();
  formData.append(options.jsonPropertyName, value);

  const body = window.cordova ? { [options.jsonPropertyName]: value} : formData;

  const requestOptions = {
    method: 'PUT',
    body,
    cordova: true,
    serializer: 'urlencoded',
    headers: {
      "Accept": "application/json",
    }
  };

  return fetch(url, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw response;
    })
    .then((json) => {
      [wheelmapFeatureCache, wheelmapLightweightFeatureCache].forEach(cache => {
        if (cache.getCachedFeature(String(featureId))) {
          cache.updateFeatureAttribute(String(featureId), { [propertyName]: value });
        }
      });
      if (typeof options.onSave === 'function') options.onSave(value);
    }) 
    .catch((e) => {
      if (typeof options.onClose === 'function') options.onClose();
      // translator: Shown after marking a place did not work, for example because the connection was interrupted
      window.alert(t`Sorry, could not mark this place because of an error: ${e}`);
    });
}


export function saveToiletStatus(options: ExternalSaveOptions<YesNoUnknown>) {
  const url = `${config.wheelmapApiBaseUrl}/nodes/${options.featureId}/update_toilet.js?api_key=${config.wheelmapApiKey}`;
  return save({ ...options, url, propertyName: 'wheelchair_toilet', jsonPropertyName: 'toilet' });
}


export function saveWheelchairStatus(options: ExternalSaveOptions<YesNoLimitedUnknown>) {
  const url = `${config.wheelmapApiBaseUrl}/nodes/${options.featureId}/update_wheelchair.js?api_key=${config.wheelmapApiKey}`;
  return save({ ...options, url, propertyName: 'wheelchair', jsonPropertyName: 'wheelchair' });
}
