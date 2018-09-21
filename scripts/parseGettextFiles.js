const gettextParser = require('gettext-parser');
const fs = require('fs');
const path = require('path');

const i18nBasePath = './src/static/i18n';
const outputFilename = './src/lib/translations.json';

function removeEmptyTranslations(locale) {
  if (!locale.translations) return locale;
  const translations = locale.translations[''];
  if (!translations) return locale;
  const missingKeys = Object.keys(translations).filter(translationKey => {
    const translation = translations[translationKey];
    if (!translation) return true;
    if (!translation.msgstr) return true;
    if (translation.msgstr.length === 0) return true;
    if (translation.msgstr.length === 1 && translation.msgstr[0] === '') return true;
    return false;
  });
  missingKeys.forEach(key => delete translations[key]);
  return locale;
}

function getGettextFileNames() {
  return fs.readdirSync(i18nBasePath).filter(filename => filename.match(/.txt$/));
}

function parseGettextFiles(filenames = getGettextFileNames()) {
  console.log('Parsing', filenames);
  const result = {};
  for (const filename of filenames) {
    console.log('Parsing', filename, '...');
    const locale = path.basename(filename, '.txt');
    const poFile = fs.readFileSync(path.join(i18nBasePath, filename));
    const localization = removeEmptyTranslations(gettextParser.po.parse(poFile));
    result[locale] = localization;
  }
  return result;
}

function writeJSON(data) {
  const filename = outputFilename;
  console.log('Writing', filename);
  fs.writeFileSync(filename, JSON.stringify(data));
}

writeJSON(parseGettextFiles());
