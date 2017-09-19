const { extract, locale } = process.env;
const c3poConfig = {};

if (extract) {
  c3poConfig.extract = { output: 'src/i18n/translations.pot' };
}

if (locale) {
  c3poConfig.resolve = { translations: locale !== 'default' ? `src/i18n/${locale}.po` : 'default' };
}

module.exports = c3poConfig;
