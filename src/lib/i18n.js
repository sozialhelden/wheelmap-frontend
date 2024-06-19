import { normalizeLocale, tx } from "@transifex/native";

const TRANSLATIONS_TTL_SEC = 10 * 60; // 10 minutes

/**
 * Used by SSR to pass translation to browser
 *
 * @export
 * @param {*} { locale, locales }
 * @return {*}
 */
export async function getServerSideTranslations({ locale, locales }) {
  tx.init({
    token: process.env.TRANSIFEX_API_TOKEN,
  });
  // ensure that nextjs locale is in the Transifex format,
  // for example, de-de -> de_DE
  let txLocale = normalizeLocale(locale || "en");
  console.log("locale", locale, "txLocale", txLocale);
  try {
    await tx.fetchTranslations(txLocale);
  } catch (error) {
    txLocale = "en";
    await tx.fetchTranslations(txLocale);
  }

  // bind a helper object in the Native instance for auto-refresh
  tx._autorefresh = tx._autorefresh || {};
  if (!tx._autorefresh[txLocale]) {
    tx._autorefresh[txLocale] = Date.now();
  }

  // check for stale content in the background
  if (Date.now() - tx._autorefresh[txLocale] > TRANSLATIONS_TTL_SEC * 1000) {
    tx._autorefresh[txLocale] = Date.now();
    tx.fetchTranslations(txLocale, { refresh: true });
  }

  return {
    locale,
    locales,
    translations: tx.cache.getTranslations(txLocale),
  };
}

/**
 * Initialize client side Transifex Native instance cache
 *
 * @export
 * @param {*} { locale, translations }
 * @return {*}
 */
export function setClientSideTranslations({ locale, translations }) {
  if (!locale || !translations) return;
  tx.init({
    currentLocale: locale,
  });
  tx.cache.update(locale, translations);
}
