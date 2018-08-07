const { extract, locale } = process.env;
const ttagConfig = {
  addComments: 'translator:',
  sortByMsgid: true,
};

if (extract) {
  const output = 'public/i18n/translations.pot';
  console.log('Extracting translations to', output, '…');
  ttagConfig.extract = { output, location: 'full' };
}

if (locale) {
  ttagConfig.resolve = { translations: locale !== 'default' ? `public/i18n/${locale}.txt` : 'default' };
}

module.exports = ttagConfig;
