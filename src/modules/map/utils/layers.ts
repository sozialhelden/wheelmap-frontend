import type { LayerSpecification } from "mapbox-gl";
import { osmApiCollections } from "~/modules/map/components/OsmApiCollections";
import { getLanguage } from "~/modules/i18n/utils/language-tags";
import { fallbackLanguageTag, type LanguageTag } from "~/modules/i18n/i18n";

export function isOsmApiLayer(layer: LayerSpecification): boolean {
  return layer.id.startsWith("osm-") || layer.id.startsWith("ac-osm-");
}
export function isAccessibilityCloudLayer(layer: LayerSpecification): boolean {
  return layer.id.startsWith("ac-") || layer.id.startsWith("osm-ac-");
}
export function isSelectionLayer(layer: LayerSpecification): boolean {
  return (
    layer.id.startsWith("selected-") ||
    layer.id.startsWith("ac-selected-") ||
    layer.id.startsWith("osm-selected-") ||
    layer.id.startsWith("osm-ac-selected-") ||
    layer.id.startsWith("ac-osm-selected-")
  );
}

export function localizeLayers(
  layers: LayerSpecification[],
  language?: string,
): LayerSpecification[] {
  const fallback = getLanguage(fallbackLanguageTag);

  return layers.map((layer) => {
    return JSON.parse(
      JSON.stringify(layer).replace(
        '["get","name"]',
        `
            [
              "let",

              "user_language_name", [ "coalesce", ["get", "name:${language ?? fallback}"], ["get", "name:${fallback}"]],
              "local_name", ["coalesce", ["get", "loc_name"], ["get", "name"]],
              "default_fallback_language_name", ["get", "name:en"],

              [
                "let",
                "prio0", ["coalesce", ["var", "user_language_name"], ["var", "local_name"], ["var", "default_fallback_language_name"]],
                "prio1", ["coalesce", ["var", "local_name"], ["var", "default_fallback_language_name"]],
                "prio2", ["coalesce", ["var", "default_fallback_language_name"]],
                [
                  "format",
                  ["coalesce", ["var", "prio0"], ["var", "prio1"], ["var", "prio2"], ""],
                  {},
                  "\\n",
                  {},
                  ["case",
                    ["!=",
                      ["coalesce", ["var", "prio0"], ["var", "prio1"], ["var", "prio2"]],
                      ["coalesce", ["var", "prio1"], ["var", "prio2"]]
                    ],
                    ["coalesce", ["var", "prio1"], ["var", "prio2"], ""],
                    ["!=",
                      ["coalesce", ["var", "prio1"], ["var", "prio2"]],
                      ["var", "prio1"]
                    ],
                    ["var", "prio1"],
                    ["!=",
                      ["coalesce", ["var", "prio1"], ["var", "prio2"]],
                      ["var", "prio2"]
                    ],
                    ["var", "prio2"],
                    ""
                  ],
                  {"font-scale": 0.9, "text-color": "rgba(0,0,0,0.7)"}
                ]
              ]
            ]
          `,
      ),
    ) as LayerSpecification;
  });
}

export function setLayerSource(
  layers: LayerSpecification[],
): LayerSpecification[] {
  return layers.reduce((acc, layer) => {
    if (!isOsmApiLayer(layer) && !isAccessibilityCloudLayer(layer)) {
      return acc;
    }

    const source = osmApiCollections.find((source) =>
      layer["source-layer"]?.startsWith(source),
    );

    if (isOsmApiLayer(layer) && source) {
      acc.push({
        ...layer,
        source,
        "source-layer": "default",
        id: `${layer.id}--osm`,
      } as LayerSpecification);
    }

    if (isAccessibilityCloudLayer(layer)) {
      acc.push({
        ...layer,
        source: "ac:PlaceInfo",
        "source-layer": "place-infos",
        id: `${layer.id}--ac`,
      } as LayerSpecification);
    }

    return acc;
  }, [] as LayerSpecification[]);
}
