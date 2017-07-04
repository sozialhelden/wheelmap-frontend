// @flow

type Parts = {
  street?: ?string,
  housenumber?: ?string,
  postcode?: ?string,
  city?: ?string,
  country?: ?string,
};

export default function getAddressString(parts: Parts): ?string {
  return [
    [parts.street, parts.housenumber].filter(Boolean).join(' '),
    [parts.postcode, parts.city].filter(Boolean).join(' '),
    parts.country,
  ].filter(Boolean).join(', ');
}
