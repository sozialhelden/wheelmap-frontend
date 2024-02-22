import { Feature, wheelmapFeatureFrom } from './Feature';
import { MappingEvent } from './MappingEvent';

export function insertPlaceholdersToAddPlaceUrl(
{
  url,
  uniqueSurveyId,
  joinedMappingEvent,
  feature,
}: {
  url: string | undefined;
  uniqueSurveyId: string;
  joinedMappingEvent?: MappingEvent;
  feature?: Feature;
}) {
  const osmFeature = wheelmapFeatureFrom(feature);
  const replacements = {
    uniqueSurveyId,
    mappingEventId: joinedMappingEvent?._id,
    mappingEventName: joinedMappingEvent?.name,
    osmId: osmFeature?.properties?.osm_id,
    osmIdNumeric: osmFeature?.id,
    osmType: osmFeature?.properties?.osm_type,
  };

  let replacedUrl = url;
  if (typeof replacedUrl === 'string') {
    for (const key in replacements) {
      if (Object.prototype.hasOwnProperty.call(replacements, key)) {
        const templateString = `(?:%7[bB]|{)${key}(?:}|%7[Dd])`;
        const fieldRegexp = new RegExp(templateString, 'g');
        replacedUrl = replacedUrl.replace(fieldRegexp, replacements[key]);
        // special behavior for Wheelmap Pro:
        // if the parameter is not in a custom parameter, force-append the parameter to the URL
        if (
          replacedUrl.startsWith('https://wheelmap.pro')
          && !replacedUrl.match(fieldRegexp)
          && replacements[key]
        ) {
          try {
            const url = new URL(replacedUrl);
            url.searchParams.append(`d[${key}]`, replacements[key]);
            replacedUrl = url.toString();
          } catch(e) {
            console.error(`Could not replace ${key}=${replacements[key]} in URL '${replacedUrl}'`, e);
          }
        }
      }
    }
  }

  return replacedUrl;
}
