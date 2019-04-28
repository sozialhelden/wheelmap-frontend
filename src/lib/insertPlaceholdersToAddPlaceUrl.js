import env from './env';

export function insertPlaceholdersToAddPlaceUrl(url: ?string, uniqueSurveyId: string) {
  const replacements = {
    returnUrl: encodeURIComponent(
      `${env.public.baseUrl}/contribution-thanks?uniqueSurveyId=${uniqueSurveyId}`
    ),
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
