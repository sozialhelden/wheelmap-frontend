import { StructuredAddress } from '@sozialhelden/a11yjson'

export default function getAddressString(parts: StructuredAddress): string | undefined {
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
