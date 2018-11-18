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
    label: 'Start Mapping',
    url: 'http://www.strutcanada.com/start-mapping',
    order: 0,
  },
  {
    appId: 'strut',
    label: 'How to use',
    url: 'http://www.strutcanada.com/how-to-use',
    order: 1,
  },
  {
    appId: 'strut',
    label: 'Get Involved',
    url: 'http://www.strutcanada.com/volunteer-form',
    order: 2,
  },
  {
    appId: 'strut',
    label: 'News',
    url: 'http://www.strutcanada.com/',
    order: 3,
  },
  {
    appId: 'strut',
    label: 'Publications',
    url: 'http://www.strutcanada.com/#publications',
    order: 3,
  },
  {
    appId: 'strut',
    label: 'ARC',
    url: 'http://www.strutcanada.com/arc',
    order: 3,
  },
  {
    appId: 'strut',
    label: 'About CAF',
    url: 'http://www.strutcanada.com/caf',
    order: 3,
  },
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
