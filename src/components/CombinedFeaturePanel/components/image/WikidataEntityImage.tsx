/* eslint-disable @next/next/no-img-element */
import { omit } from 'lodash'
import { HTMLAttributes } from 'react'
import useSWR from 'swr'
import OSMFeature from '../../../../lib/model/osm/OSMFeature'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

type Props = HTMLAttributes<HTMLImageElement> & {
  feature: OSMFeature;
  prefix?: string;
  verb: string;
};

/**
 * Renders a React component that loads brand info from the Wikidata API (with SWR) and displays the
 * brand logo.
 */
export default function WikidataEntityImage(props: Props) {
  const {
    [props.prefix ? `${props.prefix}:wikidata` : 'wikidata']: entityId,
  } = props.feature.properties
  const url = `https://query.wikidata.org/sparql?query=SELECT%20%3Fo%0AWHERE%20%7B%0A%20%20%20%20wd%3A${encodeURIComponent(
    entityId,
  )}%20wdt%3A${props.verb}%20%3Fo.%0A%7D&format=json`
  const { data, error } = useSWR(entityId ? url : null, fetcher)
  if (error) return null
  if (!data) return null
  try {
    const { results } = data
    const { bindings } = results
    const { o } = bindings[0]
    const { value } = o
    const logoUrl = `${value.replace(/^http:/, 'https:')}?width=200`

    const image = ( // eslint-disable-next-line jsx-a11y/alt-text
      <img {...omit(props, 'feature', 'prefix', 'verb')} src={logoUrl} />
    )
    return image
  } catch (e) {
    return null
  }
}
