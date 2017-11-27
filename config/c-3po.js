const { extract, locale } = process.env;
const c3poConfig = {
  addComments: 'translator:',
  sortByMsgid: true,
};

if (extract) {
  const output = 'public/i18n/translations.pot';
  console.log('Extracting translations to', output, '…');
  c3poConfig.extract = { output, location: 'full' };
}

if (locale) {
  c3poConfig.resolve = { translations: locale !== 'default' ? `public/i18n/${locale}.txt` : 'default' };
}

module.exports = c3poConfig;
