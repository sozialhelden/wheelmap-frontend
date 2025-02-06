import type {
  LocalizedString,
  StructuredAddress,
} from "@sozialhelden/a11yjson";

type StringFieldStructuredAddress = { [K in keyof StructuredAddress]?: string };

export default function getAddressString(
  parts: StringFieldStructuredAddress | undefined,
): string | undefined {
  if (!parts) {
    return undefined;
  }
  return [
    [parts.street, parts.house].filter(Boolean).join(" "),
    [parts.postalCode, parts.city].filter(Boolean).join(" "),
    parts.state,
    parts.countryCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export function getLocalizedAddressString(
  address: StructuredAddress | undefined,
): LocalizedString | undefined {
  if (!address) {
    return undefined;
  }

  const locales = new Set<string>();
  const baseData: StringFieldStructuredAddress = {};
  const localizedData: Record<string, StringFieldStructuredAddress> = {};

  for (const key of Object.keys(address)) {
    const value = address[key];

    if (typeof value === "object" && value !== null) {
      for (const locale of Object.keys(value)) {
        locales.add(locale);
        localizedData[locale] = localizedData[locale] || {};
        localizedData[locale][key] = value[locale];
      }
    } else {
      baseData[key] = value;
    }
  }

  const result: LocalizedString = {};

  for (const locale of locales) {
    const data = { ...baseData, ...localizedData[locale] };
    const addressString = getAddressString(data);
    if (addressString) {
      result[locale] = addressString;
    }
  }

  return result;
}
