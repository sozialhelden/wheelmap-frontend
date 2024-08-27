import OSMFeature from './OSMFeature'

export function getLocalizableStringForOSMKey(
  feature: OSMFeature,
  prefix: string,
) {
  const prefixWithColon = `${prefix}:`
  const result = Object.fromEntries(
    Object.keys(feature.properties)
      .filter((key) => key.startsWith(prefix))
      .map((key) => [key.replace(prefixWithColon, ''), feature.properties[key]]),
  )

  if (feature.properties[prefix]) {
    result[result.en ? 'default' : 'en'] = feature.properties[prefix]
  }

  return result
}
