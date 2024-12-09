export const fetchFeatureSplitId = (type: string, id: number) => {
  if (!type || !id) {
    return null
  }
  return fetch(
    `https://api.openstreetmap.org/api/0.6/${type}/${id}.json`,
    {
      headers: { Accept: 'application/json' },
    },
  ).then((res) => res.json()).then((data) => data.elements[0])
}
