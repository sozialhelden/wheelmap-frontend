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
    label: "česky",
    active: true,
  },
  // danish
  da: {
    label: "dansk",
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
    label: "español",
    active: true,
  },
  // persian
  fa: {
    label: "فارسی",
    active: true,
  },
  // finnish
  fi: {
    label: "suomi",
    active: true,
  },
  // french
  fr: {
    label: "français",
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
    label: "हन",
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
    label: "한국어",
    active: true,
  },
  // lithuanian
  lt: {
    label: "lietuvių kalba",
    active: true,
  },
  // latvian
  lv: {
    label: "latviešu valoda",
    active: true,
  },
  //  mongolian
  mn: {
    label: "Монгол",
    active: true,
  },
  // burmese
  my: {
    label: "ဗမာစာ",
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
    label: "русский",
    active: true,
  },
  // slovak
  sk: {
    label: "slovenčina",
    active: true,
  },
  // albanian
  "sq-AL": {
    label: "Shqip",
    active: true,
  },
  // swedish
  sv: {
    label: "svenska",
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
    label: "українська",
    active: true,
  },
  // vietnamese
  vi: {
    label: "Tiếng Việt",
    active: true,
  },
  // vietnamese vietnam
  "vi-VN": {
    label: "Tiếng Việt (Việt Nam)",
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
