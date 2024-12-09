export const fetchFeaturePrefixedId = (prefixedId: string) => fetch(
  `https://api.openstreetmap.org/api/0.6/${prefixedId}.json`,
  {
    headers: { Accept: 'application/json' },
  },
).then((res) => res.json()).then((data) => data.elements[0])
