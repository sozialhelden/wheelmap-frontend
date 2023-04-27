import { MappingEvent } from './MappingEvent';

export function insertPlaceholdersToAddPlaceUrl(
  url: string | undefined,
  uniqueSurveyId: string,
  joinedMappingEvent?: MappingEvent
) {
  const replacements = {
    uniqueSurveyId,
    mappingEventId: joinedMappingEvent?._id,
    mappingEventName: joinedMappingEvent?.name,
  };

  let replacedUrl = url;
  if (typeof replacedUrl === 'string') {
    for (const key in replacements) {
      if (replacements.hasOwnProperty(key)) {
        const templateString = `{${key}}`;
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
