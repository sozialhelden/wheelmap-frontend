const translations = require('../src/lib/translations.json');
const get = require('lodash/get');

function makeid() {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < 13; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const links = [
  {
    appId: 'strut',
    label: 'Add a new place',
    url: 'https://ee.humanitarianresponse.info/x/#uZ9a6QQt',
    order: 100,
  },
];

const results = links.map((link, order) => {
  const result = {
    _id: makeid(),
    appId: link.appId,
    label: { en_US: link.label },
    url: link.url,
    order: link.order,
  };

  for (const lang in translations) {
    const t = translations[lang];
    const { label } = result;
    const translation = get(translations, [lang, 'translations', '', label, 'msgstr', 0]);
    if (translation && translation !== label) {
      result.label[t.headers.language] = translation;
    }
  }

  return result;
});

console.log(JSON.stringify(results, null, 4));
