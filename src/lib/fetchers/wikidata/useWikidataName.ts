import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function useWikidataName(entityId: string) {
  const query = `
    SELECT ?itemLabel
    WHERE {
      wd:${entityId} rdfs:label ?itemLabel.

    }
  `
  const url = `https://query.wikidata.org/sparql?query=${encodeURIComponent(query)}&format=json`

  const { data, error } = useSWR(entityId ? url : null, fetcher)
  if (error) return null
  if (!data) return null
  try {
    const { results } = data
    const { bindings } = results
    if (bindings.length === 0) return null
    const localizedString = {}
    const strings = bindings.forEach((binding) => {
      const { itemLabel } = binding
      const { 'xml:lang': languageTag, type, value } = itemLabel
      if (type === 'literal' && typeof value === 'string' && languageTag) {
        localizedString[languageTag] = value
      }
    })
    return localizedString
  } catch (e) {
    return null
  }
}
