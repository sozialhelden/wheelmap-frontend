import { MappingEvent } from './MappingEvent';

export function insertPlaceholdersToAddPlaceUrl(
  baseUrl: string,
  url: string | undefined,
  uniqueSurveyId: string,
  joinedMappingEvent?: MappingEvent
) {
  const replacements = {
    returnUrl: encodeURIComponent(
      `${baseUrl}/contribution-thanks?uniqueSurveyId=${uniqueSurveyId}`
    ),
    uniqueSurveyId,
    mappingEventId: encodeURIComponent(joinedMappingEvent?._id),
    mappingEventName: encodeURIComponent(joinedMappingEvent?.name),
  };

  let replacedUrl = url;
  if (typeof replacedUrl === 'string') {
    for (const key in replacements) {
      if (replacements.hasOwnProperty(key)) {
        const fieldRegexp = new RegExp(`{${key}}`, 'g');
        replacedUrl = replacedUrl.replace(fieldRegexp, replacements[key]);
      }
    }
  }
  return replacedUrl;
}
