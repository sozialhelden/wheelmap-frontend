export function parseAcceptLanguageString(acceptLanguage: string): string[] {
  return acceptLanguage
    .split(',')
    .map((item) => {
      const [locale, q] = item.split(';');

      return {
        locale: locale.trim(),
        score: q ? parseFloat(q.slice(2)) || 0 : 1,
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.locale);
}
