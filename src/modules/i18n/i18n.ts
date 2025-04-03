export const configuredLanguageTags = {
  // arabic
  ar: {
    label: "العربية",
    active: true,
  },
  // bulgarian
  bg: {
    label: "български език",
    active: true,
  },
  // catalan/valencian
  ca: {
    label: "Català",
    active: true,
  },
  // czech
  cs: {
    label: "Český Jazyk",
    active: true,
  },
  // danish
  da: {
    label: "Dansk",
    active: true,
  },
  // german
  de: {
    label: "Deutsch",
    active: true,
  },
  // greek
  el: {
    label: "Ελληνικά",
    active: true,
  },
  // english
  en: {
    label: "English",
    active: true,
  },
  // spanish
  es: {
    label: "Español",
    active: true,
  },
  // persian
  fa: {
    label: "فارسی",
    active: true,
  },
  // finnish
  fi: {
    label: "Suomi",
    active: true,
  },
  // french
  fr: {
    label: "Français",
    active: true,
  },
  // western frisian
  fy: {
    label: "Frysk",
    active: true,
  },
  // galician
  gl: {
    label: "Galego",
    active: true,
  },
  // hebrew
  he: {
    label: "עברית",
    active: true,
  },
  // hindi
  hi: {
    label: "हिन्दी",
    active: true,
  },
  // hungarian
  hu: {
    label: "Magyar",
    active: true,
  },
  // icelandic
  is: {
    label: "Íslenska",
    active: true,
  },
  // italian
  it: {
    label: "Italiano",
    active: true,
  },
  // japanese
  ja: {
    label: "日本語",
    active: true,
  },
  // korean
  ko: {
    label: "조선말",
    active: true,
  },
  // lithuanian
  lt: {
    label: "Lietuvių",
    active: true,
  },
  // latvian
  lv: {
    label: "latviešu",
    active: true,
  },
  //  mongolian
  mn: {
    label: "Монгол Хэл",
    active: true,
  },
  // burmese
  my: {
    label: "မြန်မာစာ",
    active: true,
  },
  // norwegian
  nb: {
    label: "Norsk bokmål",
    active: true,
  },
  // dutch/flemish
  nl: {
    label: "Nederlands",
    active: true,
  },
  // norwegian nynorsk
  nn: {
    label: "Norsk nynorsk",
    active: true,
  },
  // norwegian
  no: {
    label: "Norsk",
    active: true,
  },
  // N'ko
  nqo: {
    label: "ߒߞߏ",
    active: true,
  },
  // polish
  pl: {
    label: "polski",
    active: true,
  },
  // portuguese
  pt: {
    label: "Português",
    active: true,
  },
  // portuguese brazil
  "pt-BR": {
    label: "Português (Brasil)",
    active: true,
  },
  // portuguese portugal
  "pt-PT": {
    label: "Português (Portugal)",
    active: true,
  },
  // romanian
  ro: {
    label: "Română",
    active: true,
  },
  // romanian romania
  "ro-RO": {
    label: "Română (România)",
    active: true,
  },
  // russian
  ru: {
    label: "Русский",
    active: true,
  },
  // slovak
  sk: {
    label: "Slovenčina",
    active: true,
  },
  // albanian
  "sq-AL": {
    label: "Shqip",
    active: true,
  },
  // swedish
  sv: {
    label: "Svenska",
    active: true,
  },
  // swahili
  sw: {
    label: "Kiswahili",
    active: true,
  },
  // klingon
  tlh: {
    label: "tlhIngan-Hol",
    active: true,
  },
  // turkish
  tr: {
    label: "Türkçe",
    active: true,
  },
  // ukrainian
  uk: {
    label: "Українська",
    active: true,
  },
  // vietnamese
  vi: {
    label: "tiếng Việt",
    active: true,
  },
  // vietnamese vietnam
  "vi-VN": {
    label: "tiếng Việt (Việt Nam)",
    active: true,
  },
  // chinese simplified
  "zh-Hans": {
    label: "简体中文",
    active: true,
    script: true,
  },
  // chinese traditional
  "zh-Hant": {
    label: "繁體中文",
    active: true,
    script: true,
  },
  // chinese
  zh: {
    label: "中文",
    active: true,
  },
  // chinese taiwan
  "zh-TW": {
    label: "中文 (台灣)",
    active: true,
  },
} as const;

export type LanguageTag = keyof typeof configuredLanguageTags;

export type LanguageTagProperties = {
  label: string;
  active: boolean;
  script?: boolean;
};

// we're using const assertions in order to automatically infer the LanguageTag
// type using keyof from the configured language tags above. but in order to make
// sure the configuration above is also typesafe, we type the config separately
// here. if something is off with the config above, typescript will show an error
// on this languageTags variable instead. this is not ideal, but it ensures
// type-safety and allows for auto-type magic.
export const languageTags: Record<LanguageTag, LanguageTagProperties> =
  configuredLanguageTags;

export const fallbackLanguageTag: LanguageTag = "en";

export const supportedLanguageTags = Object.entries(languageTags).reduce(
  (acc, [languageTag, { active }]) => {
    if (active) acc.push(languageTag);
    return acc;
  },
  [] as string[],
) as LanguageTag[];

export const supportedLanguageTagsOptions: {
  value: LanguageTag;
  label: string;
}[] = supportedLanguageTags.map((tag) => {
  return {
    value: tag,
    label: languageTags[tag].label,
  };
});
