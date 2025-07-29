import { fallbackLanguageTag, getLanguage } from "@sozialhelden/core";
import type { LayerSpecification } from "mapbox-gl";

export function filterFeaturesOnLayerByIds(
  layer: LayerSpecification,
  featureIds: string[],
): LayerSpecification {
  const filters = featureIds.map((featureId) => [
    "==",
    ["get", "id"],
    featureId,
  ]);

  return {
    ...layer,
    layout: {
      ...layer.layout,
      // when no features are selected, we simply hide the layer completely
      visibility: filters.length > 0 ? "visible" : "none",
    },
    filter: [
      "all",
      ...filters,
      ...(layer.filter?.[0] === "all" ? layer.filter.slice(1) : [layer.filter]),
    ],
  } as LayerSpecification;
}

export function addLabelInOriginalLanguage(
  layers: LayerSpecification[],
  currentLanguage?: string,
  darkMode?: boolean,
): LayerSpecification[] {
  const fallbackLanguage = getLanguage(fallbackLanguageTag);

  return layers.map((layer) => {
    return JSON.parse(
      JSON.stringify(layer).replace(
        '["get","name"]',
        `
            [
              "let",

              "user_language_name", [ "coalesce", ["get", "name:${currentLanguage ?? fallbackLanguage}"], ["get", "name:${fallbackLanguage}"]],
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
                  {"font-scale": 0.9, "text-color": "${darkMode ? "rgb(255,255,255)" : "rgba(0,0,0,0.7)"}" }
                ]
              ]
            ]
          `,
      ),
    ) as LayerSpecification;
  });
}
