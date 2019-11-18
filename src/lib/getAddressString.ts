// @flow

type Parts = {
  street?: string | undefined,
  housenumber?: string | undefined,
  postcode?: string | undefined,
  city?: string | undefined,
  state?: string | undefined,
  country?: string | undefined,
};

export default function getAddressString(parts: Parts): string | undefined {
  return [
    [parts.street, parts.housenumber].filter(Boolean).join(' '),
    [parts.postcode, parts.city].filter(Boolean).join(' '),
    parts.state,
    parts.country,
  ]
    .filter(Boolean)
    .join(', ');
}
