const { extract, locale } = process.env;
const c3poConfig = {
  addComments: 'translator:',
  sortByMsgid: true,
};

if (extract) {
  c3poConfig.extract = { output: 'public/i18n/translations.pot', location: 'full' };
}

if (locale) {
  c3poConfig.resolve = { translations: locale !== 'default' ? `public/i18n/${locale}.txt` : 'default' };
}

module.exports = c3poConfig;
