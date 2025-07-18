import { externalDataSources } from "~/modules/map/sources";

export function hasExternalSource(layerId: string): boolean {
  return externalDataSources.some(({ layerNamePrefix }) =>
    layerId.startsWith(layerNamePrefix),
  );
}

export function getExternalSources(
  layerId: string,
):
  | { id: string; source: string; "source-layer": string; "@type": string }[]
  | undefined {
  const { layerId: layerIdWithoutPrefixes, prefixes } =
    getAndRemovePrefixesFromLayerId(layerId);

  return prefixes
    .map((prefix) => {
      const source = externalDataSources.find(
        ({ layerNamePrefix }) => layerNamePrefix === prefix,
      );
      if (!source) {
        return undefined;
      }
      return {
        id: `${prefix}${layerIdWithoutPrefixes}`,
        source: source.config.id,
        "source-layer": source.sourceLayer,
        // TODO: this is used hydrate data from external sources with a @type property.
        //  This should ideally be removed and each backend returns the proper @type property itself.
        "@type": source.type,
      };
    })
    .filter((s) => s !== undefined);
}

export function getAndRemovePrefixesFromLayerId(
  layerId: string,
  prefixes: string[] = [],
): { layerId: string; prefixes: string[] } {
  let layerIdWithoutPrefixes = layerId;

  for (const { layerNamePrefix } of externalDataSources) {
    if (layerIdWithoutPrefixes.startsWith(layerNamePrefix)) {
      prefixes.push(layerNamePrefix);
      layerIdWithoutPrefixes = layerIdWithoutPrefixes.replace(
        layerNamePrefix,
        "",
      );
    }
  }

  if (layerIdWithoutPrefixes !== layerId) {
    return getAndRemovePrefixesFromLayerId(layerIdWithoutPrefixes, prefixes);
  }
  return { layerId: layerIdWithoutPrefixes, prefixes };
}

export function removePrefixesFromLayerId(layerId: string): string {
  return getAndRemovePrefixesFromLayerId(layerId).layerId;
}
