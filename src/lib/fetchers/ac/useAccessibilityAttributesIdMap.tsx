import { useMemo } from "react";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";
import { fallbackLanguageTag } from "~/modules/i18n/i18n";
import { getFuzzilyExtendedLocales } from "~/modules/i18n/utils/locales";
import type IAccessibilityAttribute from "../../model/ac/IAccessibilityAttribute";
import useCollectionSWR from "./useCollectionSWR";

export type AccessibilityAttributesMap = Map<string, Record<string, string>>;

export function generateSearchParams() {
  // either fetches a response over the network,
  // or returns a cached promise with the same URL (if available)

  const { languageTag } = useI18nContext();
  const preferredLocales = [
    ...getFuzzilyExtendedLocales(languageTag),
    ...getFuzzilyExtendedLocales(fallbackLanguageTag),
  ];

  const localizedFields = preferredLocales.flatMap((l) => [
    `label.${l}`,
    `shortLabel.${l}`,
    `summary.${l}`,
    `details.${l}`,
  ]);

  const params = {
    limit: "10000",
    surrogateKeys: "false",
    include: `effects,${localizedFields.sort().join(",")}`,
  };

  return new URLSearchParams(params);
}

export default function useAccessibilityAttributesIdMap() {
  const params = generateSearchParams();
  const response = useCollectionSWR({
    type: "ac:AccessibilityAttribute",
    params,
  });

  const { data } = response;

  const map = useMemo(
    () =>
      data &&
      new Map<string, IAccessibilityAttribute>(
        data?.results?.map((r) => [r._id, r]),
      ),
    [data],
  );

  const responseWithMap = useMemo(
    () => ({ ...response, map }),
    [response, map],
  );
  return responseWithMap;
}
