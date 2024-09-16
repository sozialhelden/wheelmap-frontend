import { StructuredAddress } from '@sozialhelden/a11yjson'

type StringFieldStructuredAddress = { [K in keyof StructuredAddress]?: string }

export default function getAddressString(parts: StringFieldStructuredAddress): string | undefined {
  if (!parts) {
    return undefined
  }
  return [
    [parts.street, parts.house].filter(Boolean).join(' '),
    [parts.postalCode, parts.city].filter(Boolean).join(' '),
    parts.state,
    parts.countryCode,
  ]
    .filter(Boolean)
    .join(', ')
}
